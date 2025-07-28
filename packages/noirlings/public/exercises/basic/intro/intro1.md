---
id: intro1
title: intro1
category: intro
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: >-
      This exercise is already complete! Study the structure of the main
      function and the test - this is the basic template for all Noir programs.
    description: >-
      Noir is an open-source DSL (Domain specific language) for construction of privacy-preserving zk programs.


      ZK programs are programs that can generate short proof of statements without revealing all inputs to the statements.


      Welcome to Noirlings! This is a project based on the original [Noirlings](https://github.com/raven-house/noirlings) by [@satyambnsal](https://x.com/satyambnsal).

      Like what you see? Contribute to [Noirlings.app](https://github.com/0xandee/noirlings-app) and follow [@andeebtceth](https://x.com/andeebtceth)!


      #### Docs
    docLink: "https://noir-lang.org/docs/getting_started"
---

Noir is an open-source DSL (Domain specific language) for construction of privacy-preserving zk programs.

ZK programs are programs that can generate short proof of statements without revealing all inputs to the statements.

This project is inspired by and builds upon the original [Noirlings](https://github.com/raven-house/noirlings) by [@satyambnsal](https://x.com/satyambnsal). If you like this project, here's the Github [repo](https://github.com/0xandee/noirlings-app) and me [@andeebtceth](https://x.com/andeebtceth) on X!

This exercise doesn't do anything yet but it still compiles! Noir file getting run
needs to have a `main` function. So this file is a valid Noir file.
Other exercises will require you to write Noir code to make the exercise file compile.

```noir
fn main(x: Field, y: pub Field) {
    assert(x != y);
}

#[test]
fn test_main() {
    let a: Field = 2;
    let b: Field = 5;
    main(a, b);
}

#[test(should_fail)]
fn test_failure() {
    main(2, 2);
}

```
