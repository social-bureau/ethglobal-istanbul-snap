import type { OnCronjobHandler, OnRpcRequestHandler } from '@metamask/snaps-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  const _request:any = request
  const _origin:any = origin

  console.log("onRpcRequest called...")
  console.log("_origin => %o",_origin)
  console.log("_request => %o",_request)
  if (
    _origin === "http://localhost:8000" ||
    _origin === "http://localhost:4200" ||
    _origin === "https://chat-ethglobal-n2n.socialbureau.io"
  ) {
    switch (request.method) {
      case 'hello': {
        const res = await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'confirmation',
            content: panel([
              text(`Hello, **${_origin}**!`),
              text('text 1'),
              text(
                'text 2',
              ),
            ]),
          },
        });
        console.log("request.method['hello'] res... %o",res)
        if (res) {
          const walletAddress = await snap.request({
            method: 'snap_dialog',
            params: {
              type: 'prompt',
              content: panel([
                heading('What is the wallet address?'),
                text('Please enter the wallet address to be monitored'),
              ]),
              placeholder: '0x123...',
            },
          });
          console.log("request.method['hello'] walletAddress... %o",walletAddress)
        }
        return false;
      }
      case "hello_world": {
        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading("+!+!+!!+!+ Welcome to xxx Snap!"),
              divider(),
              text("xxxyyyy Start getting notifications xxxyyyy"),
            ]),
          },
        });
        return true;
      }
      case "hello_world_noti": {
        // const { title, message } = request.params;
        let alertBody = request.params.alertBody;
        if(!alertBody){
          alertBody = "You have a new notifications!";
        }
        await snap.request({
          method: "snap_dialog",
          params: {
            type: "alert",
            content: panel([
              heading(alertBody),
            ]),
          },
        });

        const message = request.params.messageBody;
        await snap.request({
          method: 'snap_notify',
          params: {
            type: 'inApp',
            message,
          },
        });
        return true;
      }
      default:
        throw new Error('Method not found.');
    }
  } else {
    await snap.request({
      method: "snap_dialog",
      params: {
        type: "alert",
        content: panel([
          heading("Error"),
          text("This dapp is not supported THIS_SNAP!"),
        ]),
      },
    });
    return true;
  }
};


export const onCronjob: OnCronjobHandler = async ({ request }) => {
  switch (request.method) {
    case "fireCronjob": {
      // TODO: noti with cronjob
    }
    default:
      throw new Error("Method not found.");
  }
};
