# Cordova Laboratory

> Caution: Safety Goggles are Recommended!

## Purpose

The purpose of this repo is for experimental code. Examples include demo apps,
native api explorations, or anything really that does not fit in an existing Cordova platform.

## Project Organization

> Everyone works on a branch

`master` branch should *never* have content.

Each project should create a separate branch to work on. There are major benefits
to this practice:

- Each project has an isolate git history, which allows for easy migration to
  a new git repository;
- Working directory is not polluted with the files of other projects.
- Projects will not step on each others toes.

## Moving Out of Labs

Someday, your labs project may have it's own repository. You can easily move
all of your Git history to your new repository:

    # cd to labs and checkout your project's branch
    cd incubator-cordova-labs
    git checkout my-branch

    # add your new repository as a remote
    git add remote my-remote <url>

    # currently, my-remote is empty (has no commits)

    # push my-branch to my-remote's master branch
    git push my-remote my-branch:master

    # now clone your new project (my-remote)
    cd ..
    git clone <url>
