import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import React from 'react';

const ServerNoticeDialog = () => {
  return (
    <Dialog.Root defaultOpen>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0 z-40" />
        <Dialog.Content
          className="fixed z-50 left-1/2 -translate-x-1/2 mt-20 
          w-[95%] sm:w-[90%] max-w-xl bg-white p-4 sm:p-6 rounded-xl shadow-lg 
          max-h-[80vh] overflow-y-auto"
        >
          <Dialog.Title className="text-sm sm:text-xl lg:text-xl font-semibold mb-2">
            😵‍💫Server ne kaha ‘bhai bas ab aur nahi’–thodi der mein milte hain!😌
          </Dialog.Title>

          <Dialog.Description className="text-xs sm:text-base font-semibold text-gray-700 mb-2">
            Thank you for visiting CGU Marketplace.
          </Dialog.Description>

          <Dialog.Description className="text-xs sm:text-base text-gray-700 mb-4">
            Due to high traffic and limited server capacity, our website may be temporarily unavailable at times.
            <br /><br />
            We’re a small team working without external funding (just our own savings). We believe in keeping this platform <span className="font-bold">free for all users</span> and <span className="font-bold">nonprofit for us</span>. And while we’re thrilled by the <span className="font-bold">server-breaking response</span>, it's a bit more than our current setup can handle.
            <br /><br />
            We truly appreciate your <span className="font-bold">Trust</span>, <span className="font-bold">Belief</span>, and <span className="font-bold">Faith</span> towards us and being part of our journey.
            <br /><br />
            <span className="font-bold">— CGU Marketplace Team</span>
            <br /><br />
            <span className="font-semibold">Talk to us:</span>{' '}
            <a
              href="mailto:cgumarketplace@gmail.com"
              className="text-blue-600 underline break-words text-xs     italic"
            >
              cgumarketplace@gmail.com
            </a>
          </Dialog.Description>

          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ServerNoticeDialog;
