# Codium Runner README

It simply runs code in terminal. 💻  
You can customize commands as you like from `settings.json` ⚙️.  
By default it runs C/C++ ➕, Python 🐍, JS 📜 , Java ☕ and Makefiles✨.

## Usage

you need to activate it by `ctrl + shift + p` then type `Run Code`. The file openned will run in termainal. You can also click the status bar item named
`⯈ Run Code`.

![Usage Example](https://raw.githubusercontent.com/AFgit1/Runner_git/refs/heads/main/media/usage.gif)

## Example Configuration

To use custom commands, users can add them to `settings.json` like this:

```json
{
  //rest of your settings ...

  "runner.customCommands": [
    {
      "language": "c",
      "commandWindows": "gcc \"${filePath}\" -o \"${directoryPath}/${executableName}\" && \"${directoryPath}/${executableName}\"",
      "commandLinux": "gcc ${filePath} -o ${directoryPath}/${executableName} && ${directoryPath}/${executableName}"
    },
    {
      "language": "cpp",
      "commandWindows": "g++ \"${filePath}\" -o \"${directoryPath}/${executableName}\" && \"${directoryPath}/${executableName}\"",
      "commandLinux": "g++ ${filePath} -o ${directoryPath}/${executableName} && ${directoryPath}/${executableName}"
    },
    {
      "language": "py",
      "commandWindows": "python \"${filePath}\"",
      "commandLinux": "python3 ${filePath}"
    },
    {
      "language": "js",
      "commandWindows": "node \"${filePath}\"",
      "commandLinux": "node ${filePath}"
    },
    {
      "language": "ts",
      "commandWindows": "ts-node \"${filePath}\"",
      "commandLinux": "ts-node '${filePath}'"
    },
    {
      "language": "java",
      "commandWindows": "cd /d \"${directoryPath}\" && javac ${fileName} && java ${executableName}",
      "commandLinux": "cd ${directoryPath} && javac ${fileName} && java ${executableName}"
    },
    {
      "language": "pl",
      "commandWindows": "perl \"${filePath}\"",
      "commandLinux": "perl \"${filePath}\""
    },
    {
      "language": "m",
      "commandWindows": "cd /d ${directoryPath} && octave ${fileName}",
      "commandLinux": "cd ${directoryPath} && octave ${fileName}"
    },
    {
      "language": "sh",
      "commandLinux": "bash '${filePath}'"
    },
    {
      "language": "html",
      "commandWindows": "firefox.exe '${filePath}'",
      "commandLinux": "firefox '${filePath}'"
    },
    {
      "language": "dart",
      "commandWindows": "cd /d ${directoryPath} && d:\\sources\\dart-sdk\\bin\\dart.exe run ${fileName}",
      "commandLinux": "dart run '${filePath}'"
    },
    {
      "language": "mk",
      "commandWindows": "cd /d ${directoryPath} && make -f '${fileName}'",
      "commandLinux": "cd ${directoryPath} && make -f '${fileName}'"
    }
  ]
}
```

### **Keywords of `settings.json`**

- `${filePath}` : full file name with its path, eg: `~/Documents/CodeFolder/app.c`
- `${directoryPath}` : parent directory path, eg: `~/Documents/CodeFolder`
- `${fileName}` : file name only, eg: `app.c`
- `${executableName}` : file name only without the extention, eg: `app`

# Notes :

for windows :

- Change command for java to be `cd /d {Path}` instead of `cd {Path}` so it can change drives.
- Make `default terminal` to be `command prompt` from VsCode settings

```json
{
  "language": "java",
  "command": "cd /d '${directoryPath}' && javac ${fileName} && java ${executableName}"
}
```

# What's new ?

- You can now build entire project 🚀 with Codium Runner using custom Makefiles! 🔨 Streamline your workflow, automate tasks, and enhance efficiency. Get started today! 🎉
