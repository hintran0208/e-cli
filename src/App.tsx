import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import gradient from "gradient-string";
import { spawn } from "child_process";

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [selectedModeIndex, setSelectedModeIndex] = useState(0);
  const [showToolSelection, setShowToolSelection] = useState(false);
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);
  const [showGeminiSetup, setShowGeminiSetup] = useState(false);
  const [selectedTool, setSelectedTool] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [loadingDots, setLoadingDots] = useState(0);

  // Animation for loading dots
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExecuting) {
      interval = setInterval(() => {
        setLoadingDots((prev) => (prev + 1) % 4);
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExecuting]);

  useInput((inputChar: string, key: any) => {
    if (key.return) {
      if (showModeSelection) {
        // Handle mode selection
        if (selectedModeIndex === 0) {
          console.log("Default mode selected");
          setShowModeSelection(false);
          setShowToolSelection(true);
        } else if (selectedModeIndex === 1) {
          console.log("Scenario mode selected");
          setShowModeSelection(false);
          // For scenario mode, we might handle differently later
        }
        setSelectedModeIndex(0);
        setInput("");
      } else if (showToolSelection) {
        // Handle tool selection
        const tools = ["Claude Code", "Gemini CLI", "CodeX OpenAI"];
        const selectedToolName = tools[selectedToolIndex];
        console.log(`${selectedToolName} selected`);
        setSelectedTool(selectedToolName);
        
        if (selectedToolName === "Gemini CLI") {
          setShowToolSelection(false);
          setShowGeminiSetup(true);
        } else {
          setShowToolSelection(false);
          console.log(`${selectedToolName} integration coming soon!`);
        }
        setSelectedToolIndex(0);
        setInput("");
      } else if (showGeminiSetup) {
        // Handle Gemini setup - save API key
        if (apiKeyInput.trim()) {
          // Set the API key as environment variable
          process.env.GEMINI_API_KEY = apiKeyInput.trim();
          setResponseText("✅ API key saved successfully!\nYou can now use: ecli gemini [your prompt]");
          setShowResponse(true);
          setShowGeminiSetup(false);
          setApiKeyInput("");
          setInput("");
        } else {
          setResponseText("❌ Please enter a valid API key");
          setShowResponse(true);
          setInput("");
        }
      } else {
        // Handle command execution
        const currentInput = input.trim();
        console.log(`Debug - Input received: "${currentInput}"`);
        if (currentInput === "/mode") {
          console.log("Mode command detected!");
          setShowModeSelection(true);
          setInput("");
          setCursorPosition(0);
          return;
        } else if (currentInput.startsWith("ecli gemini")) {
          if (selectedTool === "Gemini CLI") {
            const geminiCommand = currentInput.replace("ecli gemini", "").trim();
            if (geminiCommand) {
              // Clear input and show executing state
              setInput("");
              setCursorPosition(0);
              setShowResponse(false);
              setIsExecuting(true);
              
              // Add delay to ensure UI updates before executing
              setTimeout(() => {
                // Check if it's a quoted prompt or a CLI command
                const isQuotedPrompt = (geminiCommand.startsWith('"') && geminiCommand.endsWith('"')) || 
                                     (geminiCommand.startsWith("'") && geminiCommand.endsWith("'"));
                const isCLICommand = geminiCommand.startsWith('/');
                
                let geminiArgs: string[];
                
                if (isQuotedPrompt) {
                  // Remove quotes and use as prompt
                  const prompt = geminiCommand.slice(1, -1);
                  geminiArgs = ['gemini', '-p', prompt];
                } else if (isCLICommand) {
                  // Pass CLI command directly
                  const cliCommand = geminiCommand.substring(1); // Remove the /
                  geminiArgs = ['gemini', ...cliCommand.split(' ')];
                } else {
                  // Default: treat as prompt without quotes
                  geminiArgs = ['gemini', '-p', geminiCommand];
                }
                
                // Execute the appropriate command
                const geminiProcess = spawn('npx', geminiArgs, {
                  stdio: 'pipe',
                  shell: true
                });

                let output = '';
                let errorOutput = '';

                geminiProcess.stdout?.on('data', (data) => {
                  output += data.toString();
                });

                geminiProcess.stderr?.on('data', (data) => {
                  errorOutput += data.toString();
                });

                geminiProcess.on('close', (code) => {
                  setIsExecuting(false);
                  if (code === 0) {
                    // Clean the output - remove cached credentials and extra whitespace
                    let cleanOutput = output.trim();
                    // Remove "Loaded cached credentials." line if present
                    cleanOutput = cleanOutput.replace(/^Loaded cached credentials\.\s*\n?/gm, '');
                    cleanOutput = cleanOutput.trim();
                    
                    setResponseText(cleanOutput);
                  } else {
                    let errorMsg = "❌ Error from Gemini CLI:\n";
                    if (errorOutput.includes('API key')) {
                      errorMsg += "Please set your API key using /mode setup";
                    } else {
                      errorMsg += errorOutput.trim() || "Unknown error occurred";
                    }
                    setResponseText(errorMsg);
                  }
                  setShowResponse(true);
                });

                geminiProcess.on('error', (error) => {
                  setIsExecuting(false);
                  setResponseText(`❌ Failed to execute Gemini CLI: ${error.message}\nMake sure @google/gemini-cli is installed`);
                  setShowResponse(true);
                });
              }, 100);
            } else {
              setResponseText('Gemini CLI ready - Usage:\n• ecli gemini "your question here" - for prompts\n• ecli gemini /help - for CLI commands');
              setShowResponse(true);
              setInput("");
              setCursorPosition(0);
            }
          } else {
            setResponseText("Please select Gemini CLI first using /mode");
            setShowResponse(true);
            setInput("");
            setCursorPosition(0);
          }
          return;
        }
        console.log(`Executing: ${currentInput}`);
        process.exit(0);
      }
    } else if (showModeSelection && (key.upArrow || key.downArrow)) {
      // Handle arrow key navigation in mode selection
      if (key.upArrow) {
        setSelectedModeIndex((prev) => prev === 0 ? 1 : 0);
      } else if (key.downArrow) {
        setSelectedModeIndex((prev) => prev === 1 ? 0 : 1);
      }
    } else if (showToolSelection && (key.upArrow || key.downArrow)) {
      // Handle arrow key navigation in tool selection
      if (key.upArrow) {
        setSelectedToolIndex((prev) => prev === 0 ? 2 : prev - 1);
      } else if (key.downArrow) {
        setSelectedToolIndex((prev) => prev === 2 ? 0 : prev + 1);
      }
    } else if (showGeminiSetup && (key.backspace || key.delete)) {
      setApiKeyInput((prev) => prev.slice(0, -1));
    } else if (showGeminiSetup && inputChar && !key.ctrl && !key.meta) {
      setApiKeyInput((prev) => prev + inputChar);
    } else if (!showModeSelection && !showToolSelection && !showGeminiSetup && !isExecuting && key.leftArrow) {
      setCursorPosition((prev) => Math.max(0, prev - 1));
    } else if (!showModeSelection && !showToolSelection && !showGeminiSetup && !isExecuting && key.rightArrow) {
      setCursorPosition((prev) => Math.min(input.length, prev + 1));
    } else if (!showModeSelection && !showToolSelection && !showGeminiSetup && !isExecuting && (key.backspace || key.delete)) {
      if (cursorPosition > 0) {
        setInput((prev) => prev.slice(0, cursorPosition - 1) + prev.slice(cursorPosition));
        setCursorPosition((prev) => prev - 1);
      }
    } else if (!showModeSelection && !showToolSelection && !showGeminiSetup && !isExecuting && inputChar && !key.ctrl && !key.meta) {
      setInput((prev) => prev.slice(0, cursorPosition) + inputChar + prev.slice(cursorPosition));
      setCursorPosition((prev) => prev + 1);
    }
  });

  const title = `

 ███████╗            ██████╗  ██╗      ██╗ 
 ██╔════╝           ██╔════╝  ██║      ██║ 
 █████╗   █████╗    ██║       ██║      ██║ 
 ██╔══╝   ╚════╝    ██║       ██║      ██║ 
 ███████╗           ╚██████╗  ███████╗ ██║ 
 ╚══════╝            ╚═════╝  ╚══════╝ ╚═╝ 
`;

  if (showGeminiSetup) {
    return (
      <Box flexDirection="column" padding={1}>
        <Box marginBottom={1}>
          <Text>{gradient(["#0066ff", "#00ff66"])(title)}</Text>
        </Box>

        <Box marginBottom={1}>
          <Text color="blue">🚀 Gemini CLI Setup</Text>
        </Box>
        
        <Box marginBottom={1}>
          <Text color="whiteBright">Welcome to Gemini CLI! Please enter your API key:</Text>
        </Box>

        <Box marginBottom={1}>
          <Text color="whiteBright">Get your API key from:</Text>
          <Text color="blue">https://aistudio.google.com/app/apikey</Text>
        </Box>

        <Box
          marginTop={2}
          marginBottom={1}
          borderStyle="round"
          borderColor="blue"
          paddingLeft={1}
          paddingRight={1}
        >
          <Text color="blue">API Key: </Text>
          {apiKeyInput ? (
            <Text color="whiteBright">{"*".repeat(apiKeyInput.length)}</Text>
          ) : (
            <Text color="gray">Enter your Gemini API key</Text>
          )}
          <Text color="gray">█</Text>
        </Box>

        <Box marginTop={1}>
          <Text color="gray">Enter your API key and press Enter to save</Text>
        </Box>
      </Box>
    );
  }

  if (showToolSelection) {
    const tools = ["Claude Code", "Gemini CLI", "CodeX OpenAI"];
    return (
      <Box flexDirection="column" padding={1}>
        <Box marginBottom={1}>
          <Text>{gradient(["#0066ff", "#00ff66"])(title)}</Text>
        </Box>

        <Box marginBottom={1}>
          <Text color="whiteBright">Hey Boss! Please choose the best coding tool</Text>
        </Box>
        
        {tools.map((tool, index) => (
          <Box key={tool}>
            <Text color={selectedToolIndex === index ? "blue" : "whiteBright"}>
              {selectedToolIndex === index ? "▶ " : "  "}{tool}
            </Text>
          </Box>
        ))}

        <Box marginTop={2}>
          <Text color="gray">Use ↑↓ arrows to navigate, Enter to select</Text>
        </Box>
      </Box>
    );
  }

  if (showModeSelection) {
    return (
      <Box flexDirection="column" padding={1}>
        <Box marginBottom={1}>
          <Text>{gradient(["#0066ff", "#00ff66"])(title)}</Text>
        </Box>

        <Box marginBottom={1}>
          <Text color="whiteBright">Which mode do you want to use?</Text>
        </Box>
        
        <Box>
          <Text color={selectedModeIndex === 0 ? "blue" : "whiteBright"}>
            {selectedModeIndex === 0 ? "▶ " : "  "}Default
          </Text>
        </Box>
        <Box>
          <Text color={selectedModeIndex === 1 ? "blue" : "whiteBright"}>
            {selectedModeIndex === 1 ? "▶ " : "  "}Scenario
          </Text>
        </Box>

        <Box marginTop={2}>
          <Text color="gray">Use ↑↓ arrows to navigate, Enter to select</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text>{gradient(["#0066ff", "#00ff66"])(title)}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="whiteBright">Tips for getting started:</Text>
      </Box>
      <Text color="whiteBright">• Be specific for the best results</Text>
      <Box>
        <Text color="whiteBright">• </Text>
        <Text color="blue">/setup</Text>
        <Text color="whiteBright"> to initialize your configuration</Text>
      </Box>
      <Box>
        <Text color="whiteBright">• </Text>
        <Text color="blue">/mode</Text>
        <Text color="whiteBright"> to switch between different modes</Text>
      </Box>
      <Box>
        <Text color="whiteBright">• </Text>
        <Text color="blue">/help</Text>
        <Text color="whiteBright"> for more information</Text>
      </Box>

      {!showResponse && (
        <>
          {isExecuting ? (
            <Box marginTop={2} marginBottom={1}>
              <Text color="blue">🤖 Gemini is thinking{".".repeat(loadingDots)}</Text>
            </Box>
          ) : (
            <Box
              marginTop={2}
              marginBottom={1}
              borderStyle="round"
              borderColor="blue"
              paddingLeft={1}
              paddingRight={1}
            >
              <Text color="blue">{"> "}</Text>
              {input ? (
                <>
                  <Text color="whiteBright">{input.slice(0, cursorPosition)}</Text>
                  <Text color="whiteBright" backgroundColor="gray">{input.charAt(cursorPosition) || " "}</Text>
                  <Text color="whiteBright">{input.slice(cursorPosition + 1)}</Text>
                </>
              ) : (
                <Text color="whiteBright">Type your message or @path/to/file</Text>
              )}
            </Box>
          )}
        </>
      )}

      {showResponse && (
        <>
          <Box marginTop={2} paddingLeft={1}>
            <Text color="whiteBright">{responseText}</Text>
          </Box>
          
          <Box
            marginTop={2}
            marginBottom={1}
            borderStyle="round"
            borderColor="blue"
            paddingLeft={1}
            paddingRight={1}
          >
            <Text color="blue">{"> "}</Text>
            {input ? (
              <>
                <Text color="whiteBright">{input.slice(0, cursorPosition)}</Text>
                <Text color="whiteBright" backgroundColor="gray">{input.charAt(cursorPosition) || " "}</Text>
                <Text color="whiteBright">{input.slice(cursorPosition + 1)}</Text>
              </>
            ) : (
              <Text color="whiteBright">Type your message or @path/to/file</Text>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default App;
