import Conf from './conf.js'
import clone from './utils/clone.js'
import shell from 'shelljs'
import logSymbols from 'log-symbols'
import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs'

export async function initJSLib({ projectName }) {
  console.log(`init js lib: ${Conf.js_lib}`)

  // 下载项目模版
  await clone(`direct:${Conf.js_lib}#master`, projectName, {
    clone: true,
  })
  const pwd = shell.pwd()

  // 清理文件
  const deleteDir = ['.git', 'README.md', 'doc', 'docs']
  deleteDir.map((item) => shell.rm('-rf', pwd + `/${projectName}/${item}`))

  // 自定义配置: projectName
  let jsonData = fs.readFileSync(`${pwd}/${projectName}/package.json`, function (err, data) {
    console.log(err)
  })
  jsonData = JSON.parse(jsonData)
  jsonData['name'] = projectName
  jsonData['version'] = "1.0.0"
  let obj = JSON.stringify(jsonData, null, '\t')
  let sss = fs.writeFileSync(`${pwd}/${projectName}/package.json`, obj, function (err, data) {
    console.log(err, data)
  })

  // 自动安装依赖
  const installSpinner = ora('正在安装依赖...').start()
  if (shell.exec(`cd ${projectName} && yarn`).code !== 0) {
    console.log(logSymbols.warning, chalk.yellow('自动安装失败，请手动安装！'))
    installSpinner.fail()
    shell.exit(1)
  }
  installSpinner.succeed(chalk.green('依赖安装成功！'))
}
