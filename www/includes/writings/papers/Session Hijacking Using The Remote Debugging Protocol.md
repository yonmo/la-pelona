Session Hijacking With Chrome's Remote Debugging Protocol
=========================================================

### Codebase (Documentation Only, Now Mostly Relegated To Reference And Testing For Other Projects):

https://yonmo@bitbucket.org/yonmo/oracle.git
https://yonmo@bitbucket.org/yonmo/verity.git 

### Introduction:

During my first semester of university, I became more interested in pursuing an old covert communications project I had originally designed during my sophomore year of high-school. It was designed to function using back-end function calls to a dummy web-service; in turn, establishing communication processes and login credentials for the remote user. This was not a novel idea. Many people have pursued communications channels that are not only secure in terms of standard security practices, but are hidden from general viewing. However, in my case as a young student, seeking this on its own was a difficult process; especially when considering what I needed to know about security and general web-service design in order to accomplish the task.

Luckily for me, I ended up pretty well versed in those things due to that original dose of curiosity. So, I spent my first semester in university working to rebuild and utilize this channel as a discrete controller and modular back-end for launching custom made PoC exploits through reverse-engineering resistant malware and service injectors. As all frameworks begin, I needed somethings to fill the frame with; so, in order to give myself a starting point, I decided upon developing an exploit based upon the bug report posted by mango-pdf, jokingly known as Australia\'s only hacker.

The bug, labeled in their write up as Cookie Crimes, was in the user profile accessor portion of Google Chrome's Remote Debugging Protocol API. Despite the documentation stating it wasn't possible to access a currently logged in user-profile through the Remote Debugging Protocol, it was. This, in turn, allows one to access the plain-text cookies of users, among many other things, through the protocol's web-socket connection without authentication! This was perfect for my purposes, a locally exploitable bug that is incredibly potent and has no protections for end-point users at the time. This is what makes it perfect for post-exploitation of general consumers, a severely under-protected demographic.

### Exploitation Logic:

I managed to exploit this using a series of NodeJS libraries and communications systems built into a compiled executable that utilizes serialized objects to hide the execution flow of the payload, if for whatever reason it was to be reverse engineered. The full sequence of actions and requests between the server, the client, and the victim machine is as follows:

The scenario follows, such that the malware (client) has already been supplied to the victim machine and Google Chrome is being utilized for the victim's browsing needs.

-   The client generates a public key.

-   The client makes a request to the server, supplying the public key.

-   The server generates a public key for this specific session, upon reception of the login request.

-   The server derives a shared secret using the Diffie-Hellman key exchange.

-   The server responds to the client, supplying its public key.

-   The client derives a shared secret using the Diffie-Hellman key exchange.

-   Both the client and the server utilize their shared secrets to derive identical AES-256 symmetrical keys using the SHA-256 hashing algorithm.

-   Both the server and the client now have a shared symmetrical key that will be used to encrypt and decrypt request and responses for the remaining transactions before the client issues a verifiable logout request to the server or the server designates a certain short time limit has been exceeded, both scenarios result in the server deleting the key.

-   Following authentication, the client requests the serialized payload object from the server and associated commands left in the stack by the server.

-   The server validates and decrypts the request and responds with the data requested.

-   The client validates and decrypts the response and spawns a child-process hooking cmd.exe, executing the commands and initializing the de-pickling of the payload object into memory.

-   The payload object then executes Power-shell base64url encoded commands that launch Chrome as a head-less process with the remote debugging protocol enabled and the default user profile loaded.

-   The object then makes requests using the web-socket library and accesses the default user-profile's cookies and session data for the currently loaded web-page, after identifying the remote debugging protocol port through the info request.

-   The client then makes a request to the server logging system to dump the cookies and session data on the server.

-   The server validates and decrypts the request logging the data to the system, responding with a successful logging code.

-   The client submits the logout request to the server.

-   The server validates and logs out the client.

### Conclusion & Notes:

Regrettably, I was incredibly out of focus for my first semester due to some inter-personal issues; however, this didn't stop me from completing and presenting my findings to the members of RITSec. However, since that time I have completely re-framed the code base, added security measures for the bot controller, and wrote a detection scheme for in memory usage of this exploit.

My presentation included a demonstration on a virtual machine, hijacking a Chess.com account, which has not implemented contextful-cookies.

**Note**: I misspelled the alias of the hacker whose bug report write up became the base of my research, their correct name being "mango-pdf". I apologize and it has been rectified in my report herein.
