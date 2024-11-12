# BlackPlayer <> Last.fm Parser

## Background

I created this project in early 2023, when trying to collate my music play history. I used BlackPlayer for listening to music on my Android phone, but hadn't yet started using Last.fm, a popular service for tracking & discovering music.

Once I started using Last.fm, I wanted to port over my old play history to it. This meant exporting my BlackPlayer track statistics and converting it to a format Last.fm can understand. This is what this project is about.

I originally built this over a weekend using Node & Yarn classic, and it relied on having a local music library, which would be read for extra metadata. It worked well, but added unnecessary complexity to the system, when simply reading the BlackPlayer statistics worked well out. So, this version of the project is cleaned up a bit & using newer technologies to improve the developer experience, as well as simplifying the process to rely on one source of data, the play statistics from the app.

## Usage

## Tech Stack
