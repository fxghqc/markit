module.exports = {
  "extends": ["react-app", "airbnb"],
  "plugins": ["emotion"],
  "rules": {
    // "emotion/jsx": "error",
    "emotion/jsx-import": "error",
    "emotion/no-vanilla": "error",
    "emotion/import-from-emotion": "error",
    "emotion/styled-import": "error",
    "no-console": ["error", { allow: ["log", "warn", "error"] }],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "jsx-a11y/anchor-is-valid": [ "error", {
      "components": ["Link"],
      "specialLink": ["hrefLeft", "hrefRight"],
      "aspects": ["invalidHref", "preferButton"],
    }],
  },
};
