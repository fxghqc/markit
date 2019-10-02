// Copyright © 2018 NAME HERE <EMAIL ADDRESS>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package cmd

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/PuerkitoBio/goquery"
	"github.com/fxghqc/markit/utils"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // blank import
	"github.com/spf13/cobra"
)

var schema = `
CREATE SCHEMA IF NOT EXISTS api;

CREATE TABLE IF NOT EXISTS api.link (
	id text,
	href text UNIQUE,
	add_date bigint,
	icon text,
	title text,
	primary key (id)
);

CREATE TABLE IF NOT EXISTS api.tag (
	id text,
	name text UNIQUE,
	alias text,
	primary key (id)
);

CREATE TABLE IF NOT EXISTS api.link_tag (
	link text REFERENCES api.link,
	tag text REFERENCES api.tag,
	primary key (link, tag)
);

CREATE TABLE IF NOT EXISTS api.tag_tag (
	id text,
	companion text[]
);

CREATE OR REPLACE VIEW api.link_with_tags
    WITH (security_barrier=false)
    AS
    SELECT ll.id,
    ll.href,
    ll.add_date,
    ll.icon,
    ll.title,
    COALESCE(lt.tags, '{}'::text[]) AS tags
   	FROM api.link ll
	LEFT JOIN ( SELECT l.id,
            array_agg(t.name) AS tags
           FROM api.link l
             JOIN api.link_tag lt_1 ON lt_1.link = l.id
             JOIN api.tag t ON lt_1.tag = t.id
		  GROUP BY l.id
	) lt ON (ll.id = lt.id);

create role web_anon nologin;
grant web_anon to postgres;

grant usage on schema api to web_anon;
grant select on api.link to web_anon;
grant select on api.tag to web_anon;
grant select on api.link_tag to web_anon;
grant select on api.tag_tag to web_anon;
grant select on api.link_with_tags to web_anon;

create role admin_user nologin;
grant admin_user to postgres;
grant usage on schema api to admin_user;
grant all on api.link to admin_user;
grant all on api.tag to admin_user;
grant all on api.link_tag to admin_user;
grant all on api.tag_tag to admin_user;
grant all on api.link_with_tags to admin_user;
`

func getTagName(s *goquery.Selection) (name string) {
	if goquery.NodeName(s) == "body" {
		return s.ChildrenFiltered("h1").Text()
	}

	return s.ChildrenFiltered("h3").Text()
}

func findLinkWithTags(s *goquery.Selection) []LinkWithTags {
	results := []LinkWithTags{}

	if s.Children().Size() == 1 {
		a := s.Children().First()
		addDate, err := strconv.ParseInt(a.AttrOr("add_date", "0"), 10, 64)
		if err != nil {
			log.Fatal(err)
		}

		link := &Link{
			ID:      utils.NextID(),
			Href:    a.AttrOr("href", ""),
			AddDate: addDate * 1000,
			Icon:    a.AttrOr("icon", ""),
			Title:   a.Text(),
		}
		return append(results, LinkWithTags{
			Link: link,
			Tags: []string{},
		})
	}

	name := getTagName(s)
	dts := s.ChildrenFiltered("dl").ChildrenFiltered("dt")

	dts.Each(func(i int, dt *goquery.Selection) {
		links := findLinkWithTags(dt)
		for index := range links {
			link := &links[index]
			link.Tags = append(link.Tags, name)
		}
		results = append(results, links...)
	})

	return results
}

func findTags(root *goquery.Selection) []Tag {
	title := root.Find("h1")
	tags := root.Find("h3")

	results := []Tag{
		Tag{
			ID:   utils.NextID(),
			Name: title.Text(),
		},
	}

	tags.Each(func(i int, tag *goquery.Selection) {
		name := tag.Text()
		tagExist := false
		for _, r := range results {
			if r.Name == name {
				tagExist = true
			}
		}

		if !tagExist {
			results = append(results, Tag{
				ID:   utils.NextID(),
				Name: tag.Text(),
			})
		}
	})

	return results
}

func scrape(filename string) ([]LinkWithTags, []Tag) {

	f, err := os.Open(filename)
	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	doc, err := goquery.NewDocumentFromReader(f)
	if err != nil {
		log.Fatal(err)
	}

	// Find the review items
	rootSelection := doc.Find("body").First()
	links := findLinkWithTags(rootSelection)

	distinctedLinks := []LinkWithTags{}
	for _, link := range links {
		exist := false
		for _, dLink := range distinctedLinks {
			if link.Href == dLink.Href {
				exist = true
				break
			}
		}
		if !exist {
			distinctedLinks = append(distinctedLinks, link)
		}
	}

	// remove repeated tags
	for i := range distinctedLinks {
		link := &distinctedLinks[i]
		distinctedTags := []string{}
		for _, t1 := range link.Tags {
			exist := false
			for _, t2 := range distinctedTags {
				if t1 == t2 {
					exist = true
				}
			}

			if !exist {
				distinctedTags = append(distinctedTags, t1)
			}
		}
		if len(distinctedTags) < len(link.Tags) {
			link.Tags = distinctedTags
		}
	}

	tags := findTags(rootSelection)
	// .Each(func(i int, s *goquery.Selection) {
	// 	// For each item found, get the band and title
	// 	band := s.Find("a").Text()
	// 	title := s.Find("i").Text()
	// 	fmt.Printf("Review %d: %s - %s\n", i, band, title)
	// })

	// fmt.Printf("%+v\n", tree)
	return distinctedLinks, tags
}

func run(cmd *cobra.Command, args []string) {
	filename := args[0]

	links, tags := scrape(filename)

	db, err := sqlx.Connect("postgres",
		"user=postgres dbname=postgres password=markit port=6432 sslmode=disable")
	if err != nil {
		log.Fatalln(err)
	}

	db.MustExec(schema)

	tx := db.MustBegin()
	for _, tag := range tags {
		tx.NamedExec(
			`INSERT INTO api.tag
			(id, name)
			VALUES
			(:id, :name)`,
			&tag,
		)
	}
	tx.Commit()

	tx = db.MustBegin()

	for index, linkWithTag := range links {
		link := linkWithTag.Link

		_, err = tx.NamedExec(
			`INSERT INTO api.link
			(id, href, add_date, icon, title)
			VALUES
			(:id, :href, :add_date, :icon, :title)`,
			&link,
		)

		if err != nil {
			log.Fatalln(err)
		}

		for _, linkTag := range linkWithTag.Tags {
			var tagID string
			for _, tag := range tags {
				if linkTag == tag.Name {
					tagID = tag.ID
				}
			}
			if tagID == "" {
				continue
			}

			_, err := tx.NamedExec(
				`INSERT INTO api.link_tag
				(link, tag)
				VALUES
				(:link, :tag)`,
				&LinkTag{
					Link: link.ID,
					Tag:  tagID,
				},
			)

			if err != nil {
				log.Fatalln(err)
			}
		}

		if (index+1)%200 == 0 && index > 0 {
			tx.Commit()
			tx = db.MustBegin()
			fmt.Println("200 rows inserted.")
		}
	}
	tx.Commit()
	fmt.Println(len(links), "links", len(tags), "tags", "insert success")
}

// importCmd represents the import command
var importCmd = &cobra.Command{
	Use:   "import",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Args: cobra.ExactArgs(1),
	Run:  run,
}

func init() {
	rootCmd.AddCommand(importCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// importCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// importCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
