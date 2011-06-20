const Cc = Components.classes;
const Ci = Components.interfaces;

// Poprawniejsze sprawdzanie, czy certyfikat nie wygasl:
// /usr/src/comm-1.9.2/mozilla/security/manager/pki/resources/content/viewCertDetails.js:  } else if (verifystate == cert.CERT_EXPIRED) {
// /usr/src/comm-1.9.2/mozilla/security/manager/ssl/src/nsUsageArrayHelper.cpp:    *_verified = nsNSSCertificate::CERT_EXPIRED; break;
// /usr/src/comm-1.9.2/mozilla/security/manager/ssl/src/nsNSSCertificate.cpp:        *verificationResult = CERT_EXPIRED;
// /usr/src/comm-1.9.2/mozilla/security/manager/ssl/src/nsCertTree.cpp:      case nsIX509Cert::CERT_EXPIRED:
//
// Inne przydatne pliki:
// certManager.js
// certManager.xul
// nsICertTree.idl
// nsITreeView.idl
// nsIX509Cert.idl
// nsIX509Validity.idl
//
// /usr/src/comm-1.9.2/mozilla/security/manager/ssl/src/nsNSSCertificate.cpp
// NS_IMETHODIMP
// nsNSSCertificate::VerifyForUsage(PRUint32 usage, PRUint32 *verificationResult)
//
// enh#1: poprawic sposob walidacji na korzystajacy z mechanizmow TB

var {appname}  = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.gfiltersimportexportBundle = Cc["@mozilla.org/intl/stringbundle;1"].getService(Ci.nsIStringBundleService);
    this.mystrings = this.gfiltersimportexportBundle.createBundle("chrome://{appname}/locale/overlay.properties");


    var deleteButton = document.getElementById("email_deleteButton");

    if (!deleteButton) { return; }

    // Create our new button.
    var removeInvalidDateButton = document.createElement("button");
    removeInvalidDateButton.setAttribute("id", "email_removeInvalidDateButton");
    removeInvalidDateButton.setAttribute("class", "normal");
    removeInvalidDateButton.setAttribute("label",
                  this.getString("removeInvalidDate.label"));
    removeInvalidDateButton.setAttribute("accesskey",
                  this.getString("removeInvalidDate.accesskey"));
    removeInvalidDateButton.setAttribute("oncommand",
                  "{appname}.removeInvalidCerts();");

    deleteButton.parentNode.insertBefore(removeInvalidDateButton, deleteButton);
  },
  getString:function(key) {
    try {
      var str = this.mystrings.GetStringFromName(key);
      return str;
    }
    catch(e) {
      return key;
    }
  },
  removeInvalidCerts:function() {
    var useConfirmWindow = false;
    var l = emailTreeView.rowCount;
    var curDate = new Date();
    curDate = curDate.getTime();

    var params = null;
    var certsToDel = new Array();
    var certIdxsToDel = new Array();
    var certCounter = 0;
    if (!useConfirmWindow) {
        params = Components.classes[nsDialogParamBlock].createInstance(nsIDialogParamBlock);
    }

    for (var i = l-1; i >= 0; i--) {//iteracja wstecz, na wszelki wypadek, bo mamy usuwanie
        var cert = emailTreeView.getCert(i);
        if (cert == null) {
            //to nie jest liść, certy są liściami drzewa
            continue;
        }
        var validity = cert.validity.notAfter / 1000;
        if (validity < curDate) {
            certCounter++;
            if (!useConfirmWindow) {
                certsToDel.push(cert.commonName);
                certIdxsToDel.push(i);
                continue;
            }
            else if (confirm(this.getString("certToDelInfo").replace("{0}", cert.commonName).replace("{1}", cert.emailAddress).replace("{2}", cert.validity.notAfterLocalTime))) {
                emailTreeView.deleteEntryObject(i);
            }
        }
    }

    if (!useConfirmWindow) {
        if (certsToDel.length > 0) {
            params.SetNumberStrings(certsToDel.length);
            params.SetInt(0,certsToDel.length);
            for (var i = 0; i < certsToDel.length; i++) {
                params.SetString(i, certsToDel[i]);
            }
            window.openDialog("chrome://{appname}/content/confirmdelete.xul", "confDel", "chrome,centerscreen,modal", params);
            if (params.GetInt(1) == 1) {
                for (var i = 0; i < certIdxsToDel.length; i++) {
                    emailTreeView.deleteEntryObject(certIdxsToDel[i]);
                }
            }
        }
        else {
            alert(this.getString("noCertToDel"));
        }
    }
    selected_tree_items = [];
    selected_index = [];
    emailTreeView.selection.clearSelection();
    return;
  }
};

window.addEventListener("load", function(e) { {appname} .onLoad(e); }, false); 
