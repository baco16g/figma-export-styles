# figma-export-styles

## Usage

```zsh
$ npm run build
$ node build/cli.js build {file_id} --token={personal_access_token}

$ cat output/styles.scss
@mixin JA_Body1_500_normal {
  font-family: "Noto Sans JP";
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0;
}
```