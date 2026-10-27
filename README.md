# 工大学伴 · 奶蛙版

[工大学伴](https://github.com/Leon-Cjl/gongda-xueban) 的分支：业务功能和普通版一致（图书馆选座预约、入馆码、签到提醒、空教室），另外加了奶蛙主题和「奶蛙小屋」陪学宠物。只出安卓。

> 非学校官方应用，与学校无关。预约、签到以学校系统为准；仅限本人账号使用。

当前版本：**1.1.15-naiwa.10**（安卓包名 `cn.qlucampus.naiwa.debug`）。

## 奶蛙小屋

入口：图书馆首页，或「我的 → 奶蛙小屋」。

- 领养并取名，设置约定学习日。只按学校记录里**明确入馆**的日子成长：首次核验当天入馆得经验，累计入馆日升级；预约成功、打开入馆码都不算。
- 五种状态（精神满满、打个小盹、有点想你、蔫蔫的、冬眠中），只结算已经结束、且有可靠记录覆盖的约定学习日；休息日不扣，放假可暂停。
- 图鉴、可选形象、互动（摸肚皮、喂点心、打气、送花……）、风景和装饰，按累计入馆日解锁。互动不加经验、不制造学习记录。
- 跟随明暗主题，支持减少动态效果。

## 代码结构

和普通版相同（见普通版 README），多出的文件：

- `app/naiwa-theme.js`、`naiwa-theme.css`、`naiwa-assets.js`：奶蛙主题。
- `app/pet-core.js`：日历、成长和解锁规则；`pet-evidence.js`：从学校记录里认定入馆；`pet-ui.js`、`pet.css`、`pet-catalog.js`：小屋、互动与图鉴。
- `app/assets/`：运行用图片；`branding/pet-masters/`：高清原图；`branding/pet-prompts.json`：生成提示词。
- `windows/`：普通版的 Windows 宿主，只作参考（奶蛙版没有电脑版），测试会读它。

## 测试

```powershell
node --test tests/*.test.cjs
python tests/serve-mobile.py   # 浏览器打开 http://127.0.0.1:8769/index.html?s=connected 预览
```

## 构建

Gradle 工程。用 Android Studio 打开仓库根目录，或命令行：

1. 安装 JDK 17、Android SDK Platform 35 和 Build Tools 35.0.0。
2. 在根目录建 `local.properties`，写 `sdk.dir=C\:\\Users\\<你>\\AppData\\Local\\Android\\Sdk`。
3. 准备签名：默认用 `.debug-signing/debug.keystore`（密码 `android`），可以复制 Android SDK 生成的 `~/.android/debug.keystore` 过来；用自己的签名时在 `gradle.properties` 或命令行里给 `naiwaStoreFile`、`naiwaStorePassword`、`naiwaKeyAlias`、`naiwaKeyPassword`。签名文件不要提交（已在 `.gitignore` 里）。
4. `.\gradlew.bat :android:assembleRelease`，产物在 `android/build/outputs/apk/release/`（不可调试的正式包）。调试时用 `assembleDebug`，包名会多一个 `.dev` 后缀，和正式包分开装。

用不同签名打的包不能覆盖安装作者发布的安装包。构建建议放在英文路径下。

## 参与开发

由 [Leon-Cjl](https://github.com/Leon-Cjl) 主导，AI 编程助手 [Claude](https://claude.com/claude-code)（Anthropic）、[Codex](https://openai.com/codex)（OpenAI）、[Gemini](https://gemini.google.com)（Google）和 [DeepSeek](https://www.deepseek.com) 参与了代码编写。

## 许可证

**代码**以 [MIT](LICENSE) 许可证开源。

**奶蛙形象相关的图片**（`app/assets/`、`branding/pet-masters/` 以及应用图标上的奶蛙角标）是根据网络参考图加工的，**不在 MIT 许可范围内**，著作权归原作者所有；仅供学习交流，请勿商用。`app/donate.png` 是作者的收款码，请勿在你自己发布的版本里沿用。
