---
order: 3
title: Debugging with less theater
subtitle: A calmer approach to bugs: collect evidence, reduce the problem, and avoid turning guesses into folklore.
summary: A calmer approach to bugs: collect evidence, reduce the problem, and avoid turning guesses into folklore.
eyebrow: Field note
date: Draft
tags: Debugging, Reliability
---

The fastest debugging sessions usually feel boring. You gather symptoms, write down what changed, narrow the search space, and verify one claim at a time.

The trap is performance: changing multiple things at once, narrating confidence too early, or treating a plausible story as proof.

## A useful loop

- Reproduce the issue or define why it cannot be reproduced yet.
- Find the smallest boundary where expected and actual behavior diverge.
- Make one change, observe the result, and keep the evidence.
