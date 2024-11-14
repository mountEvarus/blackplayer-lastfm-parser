# BlackPlayer <> Last.fm Parser

## Background

I created this project in early 2023, when trying to collate my music play history. I used BlackPlayer for listening to music on my Android phone, but hadn't yet started using Last.fm, a popular service for tracking & discovering music.

Once I started using Last.fm, I wanted to port over my old play history to it. This meant exporting my BlackPlayer track statistics and converting it to a format Last.fm can understand. This is what this project is about.

I originally built this over a weekend using Node & Yarn classic. This version of the project is cleaned up a bit & using newer technologies to improve the developer experience. Using the expectation that the phone's & the current computer's music library structure is the same, we can swap out the root path, load each file, read metadata and build a complete view of the play history. Then, we can save it to a JSON file for use.

## Usage

_This project uses bun, to make use of high performance and intuitive APIs. To learn more about how to install bun, see https://bun.sh/docs/installation._

The project expects 3 arguments:

| Name       | Shorthand | Type   | Description                                                                                       |
| ---------- | --------- | ------ | ------------------------------------------------------------------------------------------------- |
| inputRoot  | i         | String | the root filepath of the music library of the phone that the track statistics were exported from. |
| outputRoot | i         | String | the root filepath of the music library of the current computer.                                   |
| path       | i         | String | The path of the track statistics `.bpstat` file.                                                  |

To run the project, simply run the `start` script:

```bash
$ bun run start
```

Make sure to provide the arguments as stated above.

The project is run with the start command

I have setup an example in the aptly named `example` folder, which contains a test statistics file, as well as corresponding copyright-free music files, taken from pixabay.com

I have setup a custom script to provide arguments to test out the application with the example data:

```bash
$ bun run start:example
```

The resulting output should match `example/results.json`
