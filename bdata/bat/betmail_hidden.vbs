' betmail_hidden.vbs - hidden launcher for betmail.bat
' wscript itself has no window; Run(...,0,False) starts the bat in an
' invisible console window and does not wait for it.
Dim sh, bat
Set sh = CreateObject("Wscript.Shell")
bat = WScript.Arguments(0)
sh.Run """" & bat & """ __hidden__", 0, False
