import { Wallet } from "ethers";
import {
  EntryPoint,
  VerifyingPaymaster,
  VerifyingPaymaster__factory,
  TestVerifyingPaymaster,
  TestVerifyingPaymaster__factory,
} from "../typechain";
import { createAccountOwner, deployEntryPoint } from "./testutils";
import { ethers } from "hardhat";
import { hexZeroPad } from "ethers/lib/utils";

const uo = {
  initCode:
    "0xCCAC4418779B02f7f2bfBAa122534206de2e3358296601cd000000000000000000000000277a60fe8b476df00295ed8d89afca39f7f73187000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000144d1f578940000000000000000000000004afa6aeb5bd397d8e7f8889af8595227805c059c000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000005a407533259b41721622b4875c56aa64adb6302a0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000",
  sender: "0x0A500fC0F9fBC773A1AbdcBd8159285A103c3633",
  nonce: "0x0",
  callData:
    "0x519454470000000000000000000000005a407533259b41721622b4875c56aa64adb6302a000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  signature:
    "0x00000000df1edcd8bd57df38c1b8ed82bbd56c3db495f99468013bb9ec40ea9a2a11a42e181bf561b4bdeec3ba595f16e9b727fadaec88a231b80e7697aa693ed1f7e5b61b",
  maxFeePerGas: "0x8e5aad3c",
  maxPriorityFeePerGas: "0x59682f00",
  paymasterAndData:
    "0x6dfCB5E63EAb3d4F7CEE4A3d3Aa0152BA755c6C500000000000000000000000000000000000000000000000000000000655c37d400000000000000000000000000000000000000000000000000000000655c29c415690faee849c1c5775e1f0765d91ee8f8a56ef011173159113b6eb8785c1bd164df0b6f1f81c6cd31af7b910b3241bdb7bd0b0b8b852a7c3ce9bf8b1d217ee01b",
  callGasLimit: "0x14de5",
  verificationGasLimit: "0x633da",
  preVerificationGas: "0xe606",
};

const offchainSignerAddress = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";

describe.skip("UO", () => {
  let entryPoint: EntryPoint;
  let accountOwner: Wallet;
  const ethersSigner = ethers.provider.getSigner();
  let offchainSigner: Wallet;

  let paymaster: VerifyingPaymaster;
  let testPaymaster: TestVerifyingPaymaster;

  before(async function () {
    this.timeout(20000);
    entryPoint = await deployEntryPoint();
    offchainSigner = createAccountOwner();
    accountOwner = createAccountOwner();

    paymaster = await new VerifyingPaymaster__factory(ethersSigner).deploy(
      entryPoint.address,
      offchainSignerAddress
    );
    testPaymaster = await new TestVerifyingPaymaster__factory(
      ethersSigner
    ).deploy(entryPoint.address, offchainSignerAddress);
  });

  it("should pack uo", async () => {
    const { validUntil, validAfter } =
      await testPaymaster.parsePaymasterAndData(uo.paymasterAndData);
    console.log("validUntil", validUntil);
    console.log("validAfter", validAfter);
    const hash = await testPaymaster.getHash(uo, validUntil, validAfter);
    console.log(hash);
  });

  it("should validatePaymasterUserOp", async () => {
    const { validationData } = await testPaymaster.callStatic.validatePaymasterUserOp(
      uo,
      hexZeroPad("0x", 32),
      0
    );
    console.log(validationData);
  });
});
