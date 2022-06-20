import fs from 'fs';

export interface getRequestPaymentHTMLProps {
  title?: string;
  pg?: string;
  merchant_id?: string;
  pay_method: string;
  merchant_uid: string;
  name: string;
  amount: number;
  buyer_email?: string;
  buyer_name?: string;
  buyer_tel?: string;
  buyer_addr?: string;
  buyer_postcode?: string;
  buttonText?: string;
  buttonWrapperStyle?: object | string;
  buttonStyle?: object | string;
  callback_url: string;
  done_redirect_uri: string;
  fail_redirect_uri: string;
}

export interface getRequestCertifcationHTML {
  title?: string;
  imp_uid?: string;
  merchant_uid: string;
  buttonText?: string;
  buttonWrapperStyle?: object | string;
  buttonStyle?: object | string;
  [key: string]: any;
}

export const getRequestPaymentHTML = ({
  title,
  merchant_id,
  buttonText,
  buttonWrapperStyle,
  buttonStyle,
  ...props
}: getRequestPaymentHTMLProps): string => {
  if (typeof buttonWrapperStyle === 'object') {
    buttonWrapperStyle = Object.entries(buttonWrapperStyle).reduce((prev, cur) => {
      return prev + `${cur[0]}:${cur[1]}; `;
    }, '');
  }

  if (typeof buttonStyle === 'object') {
    buttonStyle = Object.entries(buttonStyle).reduce((prev, cur) => {
      return prev + `${cur[0]}:${cur[1]}; `;
    }, '');
  }

  return `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    
  </head>
  <body onload="onload();">
		<main id="buttonWrapper" style="${buttonWrapperStyle || ''}">
			<button onclick="requestPay()" style="${buttonStyle || ''}">${buttonText || '결제하기'}</button>
		</main>
    

		<!-- jQuery -->
    <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <!-- iamport.payment.js -->
    <script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js"></script>

    <script>
			const IMP = window.IMP;
			IMP.init("${merchant_id}"); // Example: imp00000000

      function requestPay() {
        IMP.request_pay(
          ${JSON.stringify(props)},
          function (response) {
            // callback
            if (response.success) {
              requestCallback({ status: 'success', data: response });
            } else {
							requestCallback({ status: 'failure', data: response });
            }
          }
        );
      }

			function requestCallback(props){
				$.ajax({
					url: '${props.callback_url}?status=' + props.status,
					method: 'POST',
					dataType: 'json',
					data: props.data,
				}).done(function(json){
					window.location.replace('${props.done_redirect_uri}');
				}).fail(function(json){
					window.location.replace('${props.fail_redirect_uri}');
				})
			}

			function onload(){
				requestPay();
			}
    </script>
  </body>
</html>
`;
};

export const getCertificationHTML = ({
  title,
  imp_uid,
  merchant_uid,
  buttonText,
  buttonWrapperStyle,
  buttonStyle,
  ...props
}: getRequestCertifcationHTML): string => {
  if (typeof buttonWrapperStyle === 'object') {
    buttonWrapperStyle = Object.entries(buttonWrapperStyle).reduce((prev, cur) => {
      return prev + `${cur[0]}:${cur[1]}; `;
    }, '');
  }

  if (typeof buttonStyle === 'object') {
    buttonStyle = Object.entries(buttonStyle).reduce((prev, cur) => {
      return prev + `${cur[0]}:${cur[1]}; `;
    }, '');
  }

  return `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    
  </head>
  <body onload="onload();">
		<main id="buttonWrapper" style="${buttonWrapperStyle || ''}">
			<button onclick="requestPay()" style="${buttonStyle || ''}">${buttonText || '결제하기'}</button>
		</main>
    

		<!-- jQuery -->
    <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <!-- iamport.payment.js -->
    <script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js"></script>

    <script>
			const IMP = window.IMP;
			IMP.init("${imp_uid}"); // Example: imp00000000

      function requestPay() {
        IMP.certification(
          ${JSON.stringify(props)},
          function (response) {
            // callback
            if (response.success) {
              requestCallback({ status: 'success', data: response });
            } else {
							requestCallback({ status: 'failure', data: response });
            }
          }
        );
      }

			function onload(){
				requestPay();
			}
    </script>
  </body>
</html>
`;
};
