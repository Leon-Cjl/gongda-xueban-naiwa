<div align="center">

# 🐸 工大学伴 · 奶蛙版

**带奶蛙陪学宠物的工大学伴分支：图书馆选座 · 入馆码 · 签到提醒 · 空教室**

<img src="https://img.shields.io/badge/版本-1.1.27--naiwa.22-blue?style=flat-square" />
<img src="https://img.shields.io/badge/platform-Android-green?style=flat-square&logo=android&logoColor=white" />
<img src="https://img.shields.io/badge/language-JavaScript-yellow?style=flat-square&logo=javascript&logoColor=black" />
<img src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square" />
<img src="https://img.shields.io/badge/状态-非官方-orange?style=flat-square" />

[下载最新版](https://github.com/Leon-Cjl/gongda-xueban-naiwa/releases)

</div>

---

> ## ⚠️ 免责声明
>
> **本项目为个人开发的非官方应用，与齐鲁工业大学无任何官方关联。**
>
> - 预约、签到以学校系统为准。
> - 仅限本人账号使用，**不得代约、转让或倒卖座位**。
> - 应用直接访问学校官方系统，**没有自建服务器**。

---

## 本次更新

同步主线至个人版 0.9.46 的共用改进，包括登录恢复、22:00 后日期选择、空教室与考试读取、弹窗和底栏交互。自动测试和浏览器合成场景通过；真实手机及学校账号尚未验证。

## 🐸 奶蛙小屋

入口：图书馆首页，或「我的 → 奶蛙小屋」。

| 功能 | 说明 |
|---|---|
| 🐣 **领养与取名** | 设置约定学习日 |
| 📈 **成长机制** | 只按学校记录里**明确入馆**的日子成长：首次核验当天入馆得经验，累计入馆日升级 |
| 🎭 **五种状态** | 精神满满、打个小盹、有点想你、蔫蔫的、冬眠中 |
| 🎮 **互动** | 摸肚皮、喂点心、打气、送花……（互动不加经验、不制造学习记录） |
| 📖 **图鉴** | 按累计入馆日解锁各种形象、风景和装饰 |
| 🌗 **主题适配** | 跟随明暗主题，支持减少动态效果 |

> 预约成功、打开入馆码都不算成长经验。只结算已经结束、且有可靠记录覆盖的约定学习日；休息日不扣，放假可暂停。

## 代码结构

和普通版相同（见[普通版 README](https://github.com/Leon-Cjl/gongda-xueban)），多出的文件：

| 文件 | 用途 |
|---|---|
| `app/naiwa-theme.js`、`naiwa-theme.css`、`naiwa-assets.js` | 奶蛙主题 |
| `app/pet-core.js` | 日历、成长和解锁规则 |
| `app/pet-evidence.js` | 从学校记录里认定入馆 |
| `app/pet-ui.js`、`pet.css`、`pet-catalog.js` | 小屋、互动与图鉴 |
| `app/assets/` | 运行用图片 |
| `branding/pet-masters/` | 高清原图 |
| `branding/pet-prompts.json` | 生成提示词 |

> `windows/`：普通版的 Windows 宿主，只作参考（奶蛙版没有电脑版），测试会读它。

## 测试

```powershell
node --test tests/*.test.cjs
python tests/serve-mobile.py   # 浏览器打开 http://127.0.0.1:8769/index.html?s=connected 预览
```

## 构建

<details>
<summary>📦 Gradle 构建步骤</summary>

用 Android Studio 打开仓库根目录，或命令行：

1. 安装 JDK 17、Android SDK Platform 35 和 Build Tools 35.0.0。
2. 在根目录建 `local.properties`，写 `sdk.dir=C\:\Users\<你>\AppData\Local\Android\Sdk`。
3. 准备签名：默认用 `.debug-signing/debug.keystore`（密码 `android`），可以复制 Android SDK 生成的 `~/.android/debug.keystore` 过来；用自己的签名时在 `gradle.properties` 或命令行里给 `naiwaStoreFile`、`naiwaStorePassword`、`naiwaKeyAlias`、`naiwaKeyPassword`。签名文件不要提交（已在 `.gitignore` 里）。
4. `.\gradlew.bat :android:assembleRelease`，产物在 `android/build/outputs/apk/release/`。调试时用 `assembleDebug`，包名会多一个 `.dev` 后缀。

</details>

> 用不同签名打的包不能覆盖安装作者发布的安装包。构建建议放在英文路径下。

## 参与开发

由 [Leon-Cjl](https://github.com/Leon-Cjl) 主导，AI 编程助手 [Claude](https://claude.com/claude-code)（Anthropic）、[Codex](https://openai.com/codex)（OpenAI）、[Gemini](https://gemini.google.com)（Google）和 [DeepSeek](https://www.deepseek.com) 参与了代码编写。

## 许可证

| 内容 | 许可 |
|---|---|
| **代码** | [MIT](LICENSE) 开源 |
| **奶蛙形象图片** | 不在 MIT 范围内，著作权归原作者所有，仅供学习交流，**请勿商用** |
| `app/donate.png` | 作者收款码，请勿在你自己发布的版本里沿用 |

## 相关项目

[Leon 的项目主页](https://github.com/Leon-Cjl) · [校园电费](https://github.com/Leon-Cjl/campus-dianfei) · [工大学伴](https://github.com/Leon-Cjl/gongda-xueban) · [奶蛙版](https://github.com/Leon-Cjl/gongda-xueban-naiwa) · [宿舍快开](https://github.com/Leon-Cjl/dorm-native-open)
