package cmd

// Link ...
type Link struct {
	ID      string `json:"id" db:"id"`
	Href    string `json:"href" db:"href"`
	AddDate int64  `json:"addDate" db:"add_date"`
	Icon    string `json:"icon" db:"icon"`
	Title   string `json:"title" db:"title"`
}

// LinkWithTags ...
type LinkWithTags struct {
	*Link
	Tags []string `json:"tags"`
}

// Tag ...
type Tag struct {
	ID    string `json:"id" db:"id"`
	Name  string `json:"name" db:"name"`
	Alias string `json:"alias" db:"alias"`
}

// LinkTag ...
type LinkTag struct {
	Link string `json:"link" db:"link"`
	Tag  string `json:"tag" db:"tag"`
}

// TagTag ...
type TagTag struct {
	ID        string   `json:"id" db:"id"`
	Companion []string `json:"companion" db:"companion"`
}

// User ... use cayley db
type User struct {
}

// UserWithTagAndLink ...
type UserWithTagAndLink struct {
}
