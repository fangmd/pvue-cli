#!/usr/bin/env node

import commander from 'commander'
import inquirer from 'inquirer'
import shell from 'shelljs'
import fs from 'fs'
import logSymbols from 'log-symbols'
import ora from 'ora'
import { initH5 } from './init-h5.js'
import { initNuxtJSPC } from './init-nuxtjs-pc.js'
import { initKoa } from './init-koa.js'
import { initVueElementAdmin } from './init-element-admin.js'

const program = commander.program

const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: '请输入项目名称:',
    validate: function (value) {
      if (!value) {
        return '请输入项目名称！'
      }
      if (value.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) {
        return '项目名称不合法！'
      }
      return true
    },
  },
  {
    type: 'list',
    name: 'type',
    message: '选择项目类型',
    choices: ['Vue H5', 'Vue Element Admin', 'NuxtJS PC', 'Koa'],
  },
]

program
  .command('init')
  .description('创建项目')
  .action((option) => {
    inquirer.prompt(questions).then((answers) => {
      const { projectName, type } = answers
      console.log(answers)
      // check git env
      if (!shell.which('git')) {
        shell.echo('git 未安装，请先安装 git')
        shell.exit(1)
      }

      // 检查但前目录是否以及存在同名的文件夹
      if (fs.existsSync(projectName)) {
        console.log(logSymbols.warning, `已存在项目文件夹${projectName}！`)
        return
      }

      if (answers.type === 'Vue H5') {
        initH5({ projectName })
      } else if (answers.type === 'NuxtJS PC') {
        initNuxtJSPC({ projectName })
      } else if (answers.type === 'Koa') {
        initKoa({ projectName })
      } else if (answers.type === 'Vue Element Admin') {
        initVueElementAdmin({ projectName })
      }
    })
  })

commander.parse(process.argv)
