const instanceUrl = window.location.origin;

$(document).ready(doInit);

function doInit() {
    let paymentJSON = JSON.parse(localStorage.getItem('payment_details'));
    $('#paymentForm').attr('action', 'https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage?mid='+paymentJSON.mid+'&orderId='+paymentJSON.orderId);
    $('#mid').attr('value', paymentJSON.mid);
    $('#orderId').attr('value', paymentJSON.orderId);
    $('#txnToken').attr('value', paymentJSON.body.txnToken);
    document.paytm.submit();
}