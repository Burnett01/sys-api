test:
	@"./node_modules/.bin/mocha" --reporter list "./test/test.default.js"

.PHONY: test
