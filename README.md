<!--
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
-->

# Cordova Labs

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

## Migrating Repositories

One day, you labs project may grow up and need it's own repository.
You can easily move all of your Git history to your new repository with the
following steps:

    # cd to labs and checkout your project's branch
    git checkout my-branch

    # add your new repository as a remote
    git add remote my-remote <url>

    # currently, my-remote should be empty (no commits)

    # push my-branch to my-remote's master branch
    git push my-remote my-branch:master

    # now clone your new project (my-remote)
    git clone <url>
