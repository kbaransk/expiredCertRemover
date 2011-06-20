const nsIX509Cert = Components.interfaces.nsIX509Cert;
const nsX509CertDB = "@mozilla.org/security/x509certdb;1";
const nsIX509CertDB = Components.interfaces.nsIX509CertDB;
const nsIPKIParamBlock = Components.interfaces.nsIPKIParamBlock;
const nsIDialogParamBlock = Components.interfaces.nsIDialogParamBlock;

//var certdb;
var gParams;

function setText(id, value) {
  var element = document.getElementById(id);
  if (!element) return;
  if (element.hasChildNodes())
    element.removeChild(element.firstChild);
  var textNode = document.createTextNode(value);
  element.appendChild(textNode);
}

function onDialogLoad() {
  gParams = window.arguments[0].QueryInterface(nsIDialogParamBlock);

  var numberOfCerts = gParams.GetInt(0);

  var bundle = srGetStrBundle("chrome://pippki/locale/pippki.properties");
  var title = bundle.GetStringFromName("deleteUserCertTitle");
  var confirm = bundle.GetStringFromName("deleteUserCertConfirm");
  var impact = bundle.GetStringFromName("deleteUserCertImpact");
  var confirReference = document.getElementById('confirm');
  var impactReference = document.getElementById('impact');
  document.title = title;

  setText("confirm",confirm);

  var box=document.getElementById("certlist");
  var text;
  for(var x=0;x<numberOfCerts;x++) {
    text = document.createElement("text");
    text.setAttribute("value", gParams.GetString(x+1));
    box.appendChild(text);
  }

  setText("impact",impact);
}

function doOK() {
  gParams.SetInt(1, 1); // means OK
  return true;
}

function doCancel() {
  gParams.SetInt(1, 0); // means CANCEL
  return true;
}
