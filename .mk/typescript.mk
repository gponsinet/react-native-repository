ifndef typescript.mk
typescript := $(lastword $(MAKEFILE_LIST))

export VOLTA_HOME := $(HOME)/.volta
export PATH := $(VOLTA_HOME)/bin:$(PATH)

prepare: typescript.prepare
typescript.prepare:
	ln -sf eslint_d node_modules/.bin/eslint

lint: typescript.lint
typescript.lint:
	node_modules/.bin/eslint_d .

fix: typescript.fix
typescript.fix:
	node_modules/.bin/eslint_d fix .

endif
