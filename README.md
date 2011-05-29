# Expired Certificates Remover

## Purpose
Thunderbird can't pick the right certificate to encript a mail, when it imports more the one certificate for an email address and only one of them is valid.
I needed a simple solution to remove the expired certificates from "other people" tab.

## Known bugs / limitations
* Changes are fully visible after restarting Thunderbird, e.g. when you remove certs and then close and reopen the certificate manager window removed certificates are displayed. Thunderbird itself (without this plugin) works this way, so I will not fix it.
* Certificates to remove should be selected using TB API functions instead of simple check of "valid until" date.