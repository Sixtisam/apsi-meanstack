# ApsiMeanstack


## Setup
Add to the file `.env` the following line:

`MONGODB_URL=<mongodb-url-connection-string>`

## Security Findings

* Statt `Access-Control-Allow-Origin: *` sollen nur die Domains erlaubt werden, die man kennt.
  * Stattdessen auch SPA und API auf gleichem Domain/Port laufen lassen, dann erübrigt sich dieses Problem.
* Den Primärschlüssel aus der Datebank nicht in der URL anzeigen, sondern stattdessen eine separaten String verwenden (auch wenn die Entropie OK ist).
* _id umbenennen, damit kein Rückschluss auf MongoDB möglich ist.
* 2 Faktor Authentifizierung einbauen
* Login künstlicher verzögern (sleep) 
* Es wird immer der gleiche Salt verwendet (10) statt `bcrypt.genSaltSync(saltRounds);` zu verwenden.
* Statt `bcyrpt` besser `Argon2` verwenden.
* Bei `jwt.verify` explizit die erlaubten Algorithmen angeben.
* Statt den Connection-String zur DB im Code/.env zu speichern, eine Vault verwenden.
* Besseres Secret für JWT verwendene, auch via Vault.
* Die HTTP-Route implizit statt explizit schützen, dafür explizit freigeben wenn ohne Login aufrufbar.
* Im Backend HTML mit Entities ersetzen, so dass ein XSS erst gar nicht möglich ist (auch wenn dies Angular für uns erledigt)
* Content-Security-Policy auch für die Angular SPA setzen.