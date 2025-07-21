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
      Every Noir program must have a `main` function - this is the entry point
      where your zero-knowledge circuit begins execution


      #### Docs
    docLink: 'https://noir-lang.org/docs/getting_started'
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
