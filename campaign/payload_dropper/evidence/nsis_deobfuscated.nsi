;Cleaned NSIS analysis view of the suspicious installer logic
; This is a reduced, deobfuscated representation of the relevant behavior only.
; It removes the boilerplate/default NSIS noise and renames the opaque variables.

!include LogicLib.nsh

Var targetProcessName
Var stagingFolderName
Var stagingFolderPath
Var installLogPath
Var installRoot

; -----------------------------------------------------------------------------
; 1) Kill a process by name
; Original behavior observed: taskkill /F /IM <name> /T
; -----------------------------------------------------------------------------
Function KillProcessByName
  Exch $0
  nsExec::ExecToStack '"$SYSDIR\taskkill" /F /IM "$0" /T'
  Pop $0
  Pop $1
FunctionEnd

; -----------------------------------------------------------------------------
; 2) Create a temporary staging folder and point the installer there
; Original behavior observed: create a folder under %TEMP% and set $INSTDIR
; -----------------------------------------------------------------------------
Function PrepareStagingFolder
  Exch $0
  StrCpy $stagingFolderName $0
  StrCpy $stagingFolderPath "$TEMP\$stagingFolderName"
  CreateDirectory $stagingFolderPath
  StrCpy $INSTDIR $stagingFolderPath
FunctionEnd

; -----------------------------------------------------------------------------
; 3) Move the install log into the staging directory
; Original behavior observed: CMD /C move /y install.log <target>
; -----------------------------------------------------------------------------
Function MoveInstallLogToStagingDir
  DetailPrint "Moving installation log from $TEMP\install.log to $INSTDIR"
  nsExec::ExecToStack '"$SYSDIR\CMD.EXE" /C move /y "$TEMP\install.log" "$INSTDIR\\"'
  Pop $0
  Pop $1
FunctionEnd

; -----------------------------------------------------------------------------
; 4) Poll for process existence and wait until it exits
; Original behavior observed: processwork::ExistsProcess + Sleep + retry loop
; -----------------------------------------------------------------------------
Function WaitForProcessToExit
  Exch $0
  StrCpy $targetProcessName $0

loop:
  Push $targetProcessName
  processwork::ExistsProcess
  Pop $5

  IntCmp $5 0 done

  Push $targetProcessName
  Call KillProcessByName
  Sleep 1000
  Goto loop

done:
  Pop $5
FunctionEnd

; -----------------------------------------------------------------------------
; Example of the suspicious execution flow that the sample appears to follow
; -----------------------------------------------------------------------------
Function .onInit
  ; In the original sample this appears to be a process-handling wrapper.
  ; The values below are placeholders for analysis purposes.
  Push "some-process.exe"
  Call WaitForProcessToExit

  ; Stage files under the temporary folder.
  Push "malware-stage"
  Call PrepareStagingFolder

  ; Move the log into the staged location.
  Call MoveInstallLogToStagingDir
FunctionEnd

Section
  ; Suspicious behavior summary:
  ; - terminates a named process using taskkill
  ; - creates a temporary working directory
  ; - moves an install log into that directory
  ; - waits for a process to exit before continuing
SectionEnd
