---
name: User Story
about: This template defines a user story
title: ''
labels: ''
assignees: ''

---

Module 1 Introduction: Project Introduction, Repository Setup, User Stories, and Database Setup
Estimated time needed: 5 minutes

This first module orients you to the project. It contains two labs. In the first lab, you develop a user story template and user stories for the entire project, and in the second lab, you set up an instance of MongoDB and populate it with data.

Finish user stories lab
In the user stories lab, you create a new repository in GitHub and make it public. You will use GitHub as your code repository for the entire project.

Next, you will create a user story template. Your template should contain three parts:

The story
Details and assumptions
Acceptance criteria
Recall that when you write a user story, you should use three phrases to form a complete sentence:

"As a",
"I need", and
"So that".
For example, "As a cat, I need somewhere to hide so that I can avoid the dog invading my personal space."

The second part of the user story template allows the author to provide details and assumptions. For example, a possible assumption for this user story might include that the hiding spot should provide sufficient cover for the cat to feel safe.

The third part includes the definition of "done" so everyone knows when the story can be considered complete. Continuing with the cat user story, the given context might be that the cat and the dog are in the same room when the cat feels threatened by the dog. The observable outcome would be that the cat can find and access its hiding spot.

You will also create labels you can apply to your user stories:

new
backlog
icebox
technical debt
Finally, you will write the user stories for each lab.

Finish populating MongoDB lab
In the second lab, you will clone a repository to the personal GitHub repository you created in the first lab. This repository will contain the directories and requisite .js, .json, .css, and .html files. Many of these files contain skeleton code to help get you started in the labs.

You will use MongoDB as the database for this project. So, first, you will initialize an instance of the database.

IMPORTANT: Note the password as directed in the lab when you start the database service.

Next, you will import sample data from a .json file into the database instance. You will make a copy of a sample .env file and update the password in this file from when you initialized the database in the previous step.

In the last step of the lab, you will validate the data import using mongosh, an interactive JavaScript interface to MongoDB.
