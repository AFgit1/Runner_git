import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';

// import * as path from 'path';
// // Extract the directory path
// const directoryPath = path.dirname(filePath);
// // Extract the file name with extension
// const fileName = path.basename(filePath);


// Create a map to track terminals by file
const terminalMap = new Map<string, vscode.Terminal>();

export function activate(context: vscode.ExtensionContext) {

  // Add a status bar item
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
  statusBarItem.text = '$(play) Run Code'; // Use an icon from VS Code's built-in icon set
  statusBarItem.command = 'runner.runCode'; // Command to run on click
  statusBarItem.tooltip = 'Run code in the active editor';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Register the command
  let disposable = vscode.commands.registerCommand('runner.runCode', () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document = editor.document;
      const filePath = document.fileName;
      const directoryPath = path.dirname(filePath);
      const fileName = path.basename(filePath);
      const executableName = path.basename(filePath).split('.')[0];
      const fileExt = path.basename(filePath).split('.')[1];

      // Read custom commands from configuration
      const config = vscode.workspace.getConfiguration('runner');
      const customCommands: { language: string; commandWindows: string; commandLinux: string }[] = config.get('customCommands') || [];

      let command: string | undefined;

      // what is PLATFORM
      const platform = os.platform(); // Detect platform

      // Check for custom commands first
      const customCommand = customCommands.find(cmd => cmd.language === fileExt);
      if (customCommand) {
        // Ensure the command string is defined
        if (platform === 'win32') {
          command = (customCommand.commandWindows) ? customCommand.commandWindows : '';
        } else {
          command = (customCommand.commandLinux) ? customCommand.commandLinux : '';
        }
      if (command) {
        command = command.replaceAll('${filePath}', filePath);
        command = command.replaceAll('${directoryPath}', directoryPath);
        command = command.replaceAll('${executableName}', executableName);
        command = command.replaceAll('${fileName}', fileName);

        //command = customCommand.command.replace('${file}', filePath).replace('${fileBasenameNoExtension}', executableName).replace('${fileBasenameNoExtension}', executableName);
      } 
    } else {
        // Fallback to default commands
        switch (fileExt) {
          case 'js':
            command = `node ${filePath}`;
            break;
          case 'py':
            command = platform === 'win32' ? `python ${filePath}` : `python3 ${filePath}`;
            break;
          case 'c':
            command = platform === 'win32'
              ? `gcc ${filePath} -o ${directoryPath}\\${executableName} && ${directoryPath}\\${executableName}`
              : `gcc ${filePath} -o ${directoryPath}/${executableName} && ${directoryPath}/${executableName}`;
            break;
          case 'cpp':
            command = platform === 'win32'
              ? `g++ ${filePath} -o ${directoryPath}\\${executableName} && ${directoryPath}\\${executableName}`
              : `g++ ${filePath} -o ${directoryPath}/${executableName} && ${directoryPath}/${executableName}`;
            break;
          case 'java':
            command = platform === 'win32'
            ? `cd /d "${directoryPath}" && javac "${fileName}" && java "${executableName}"`
            : `cd ${directoryPath} && javac ${fileName} && java ${executableName}`;
            break;
          default:
            vscode.window.showErrorMessage('Unsupported file type');
            return;
        }
      }

      if (command) {
        // Check if we already have a terminal for this file
        let terminal = terminalMap.get(filePath);
        if (!terminal || terminal.exitStatus) {
          // Create a new terminal if not already exists
          terminal = vscode.window.createTerminal({
            name: `Code Runner - ${fileName}`,
            cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath // Set the working directory to the workspace root
          });
          terminalMap.set(filePath, terminal);
            // Remove terminal from map when it's closed
            terminal.processId.then(() => {
              vscode.window.onDidCloseTerminal((closedTerminal) => {
                  if (closedTerminal === terminal) {
                      terminalMap.delete(filePath);
                  }
              });
          });
        }

        // Show the terminal
        terminal.show();

        // Send the command to the terminal
        terminal.sendText(command);
      }
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {
  // Cleanup terminals when the extension is deactivated
  terminalMap.forEach(terminal => terminal.dispose());
  terminalMap.clear();
}
