import Conf from './conf.js'
import clone from './utils/clone.js'
import shell from 'shelljs'
import logSymbols from 'log-symbols'
import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs'

export async function initKoa({ projectName }) {
  console.log(`init koa: ${Conf.KOA}`)

  // 下载项目模版
  await clone(`direct:${Conf.KOA}#master`, projectName, { clone: true })
  const pwd = shell.pwd()

  // 清理文件
  const deleteDir = ['.git', 'README.md', 'doc', 'docs']
  deleteDir.map((item) => shell.rm('-rf', pwd + `/${projectName}/${item}`))

  // 自定义配置: projectName package.json
  let jsonData = fs.readFileSync(
    `${pwd}/${projectName}/package.json`,
    function (err, data) {
      console.log(err)
    }
  )
  jsonData = JSON.parse(jsonData)
  jsonData['name'] = projectName
  jsonData['version'] = "1.0.0"
  let obj = JSON.stringify(jsonData, null, '\t')
  fs.writeFileSync(
    `${pwd}/${projectName}/package.json`,
    obj,
    function (err, data) {
      console.log(err, data)
    }
  )
  // 自定义配置: projectName pm2.config.json
  let jsonDataPM2 = fs.readFileSync(
    `${pwd}/${projectName}/pm2.config.json`,
    function (err, data) {
      console.log(err)
    }
  )
  jsonDataPM2 = JSON.parse(jsonDataPM2)
  jsonDataPM2['apps']['name'] = projectName
  let obj2 = JSON.stringify(jsonDataPM2, null, '\t')
  fs.writeFileSync(
    `${pwd}/${projectName}/pm2.config.json`,
    obj2,
    function (err, data) {
      console.log(err, data)
    }
  )

  // 自动安装依赖
  const installSpinner = ora('正在安装依赖...').start()
  if (shell.exec(`cd ${projectName} && npm install`).code !== 0) {
    console.log(logSymbols.warning, chalk.yellow('自动安装失败，请手动安装！'))
    installSpinner.fail()
    shell.exit(1)
  }
  installSpinner.succeed(chalk.green('依赖安装成功！'))
}
