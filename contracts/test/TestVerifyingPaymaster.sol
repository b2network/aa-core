// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../samples/VerifyingPaymaster.sol";

contract TestVerifyingPaymaster is VerifyingPaymaster {
    VerifyingPaymaster pm;

    constructor(
        IEntryPoint entryPoint,
        address verifyingSigner
    ) VerifyingPaymaster(entryPoint, verifyingSigner) {}


    function _requireFromEntryPoint() internal pure override {
        return;
    }
}
