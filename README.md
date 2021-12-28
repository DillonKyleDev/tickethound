# Ticket Hound
A React-based ticket tracking application with user credentials and roles.
This project came about after finishing up my last project, the ISS Travel Guide, and wanting something more challenging to work through.  After much deliberating and brainstorming I decided that a ticket tracking application would be an excellent way to test my React skills so far as well as pick up some new skills on the back end.
Little did I know what I was getting myself into!  This project was tons of fun and challenged my existing knowledge of React and how it works with a more fleshed out back end.

# Jumping In
As a new user, Ticket Hound is set up to very quickly go in and demo each of the available authorization types: Admin, Project Manager, Developer and Submitter by clicking on the icons at the initial log in page.  But we'll get back to the big picture in just a second.

# The Stack
MongoDB, Express, React, NodeJS

## NodeJS
For the meat of the back end I decided to go with NodeJS as I am very comfortable with the Javascript language already and it seemed to be the most optimal path to take.

## PassportJS
For the user authentication I took advantage of Passports cookie-based authentication, giving the user a cookie with safe authentication information, allowing them to stay on the page without having to resend the account credentials on every page change.

## Bcrypt
For encrypting passwords I chose to use Bcrypt and it was extremely straight forward to use in both encrypting and decrypting passwords safely.

## MongoDB
For the database storing all of the ticket, project and user information I decided to go with the seemingly very popular MongoDB.  This was a joy to work with and very straight forward.  The JSON-style data storage was very easy to come to grips with and start working with quickly and efficiently.  The database collection consists of Project documents and user documents.  
The Project documents each have their own array of tickets that are associated with them, as well as other basic information.  
The User document consists of pretty much what you'd expect: Name, email, encrypted password, and account type.

## React
This project was created using the React library as well as React Router for routing within the App, minimizing unnecessary communication with the back end.

# The Flow
Once a user is logged in, their authorization type determines the actions they will be able to take:

# Admin
The Admin account type can do everything! It can:
Can add new users
Can edit users names, account types and passwords
Can add new projects
Can edit projects
Can add new tickets
Can edit tickets
Can view all users in the database
Can view all projects in the database
Can view all tickets in the database

# Project Manager
The Project Manager account type is slightly more restricted:
Can add new projects
Can edit projects
Can add new tickets
Can edit tickets
Can view all users in the database
Can view all projects in the database
Can view all tickets in the database

# Developer
The Developer account type is even more so restricted:
Can add new tickets
Can edit tickets that are assigned to them
Can view all users in the database
Can only view projects that are assigned to them
Can only view tickets that are assigned to them

# Submitter
The Submitter account type is the most restricted of them all:
Can view all users in the database
Can see all tickets in the database
Can add new tickets
Cannot edit tickets


# Challenges faced
Before starting this project, I already had a good bit of React experience under my belt so I found the most challenging aspects of this projects to be understanding the use of back end technologies and how they work together.  Before jumping in and using tools like Passport, Express and Express Session, I wanted to make sure I had a thorough understanding of how these concepts worked in the default NodeJS environment.  This was where I faced most of my challenges.  Going from front end development to the back end is an interesting conceptual jump but one I had a lot of fun coming to grips with.
One of the most important aspects of the back end development for me was learning how to securely implement a back end that utilized password protection and user roles.  The thought of someone being able to see code/passwords aren't supposed to see is a terrifying one indeed, so I was sure I needed to fully comprehend all of the security features I was putting in place to maintain the highest level of integrity!  Surely I still have learning to do when it comes to the backend, but this was a great exercise in utilizing back end tools, hosting servers, and security best practices.
