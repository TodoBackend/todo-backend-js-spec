#!/bin/bash
set -e -u

bundle install --path=vendor/bundle

bundle exec rspec

