/**
 * Copyright (C) 2021-2022 diva.exchange
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * Author/Maintainer: DIVA.EXCHANGE Association, https://diva.exchange
 */

import { Message } from './message';
import { Util } from '../../chain/util';
import { TransactionStruct } from '../../chain/transaction';
import { Wallet } from '../../chain/wallet';

export type ProposalStruct = {
  type: number;
  seq: number;
  origin: string;
  height: number;
  tx: TransactionStruct;
  sig: string;
};

export class Proposal extends Message {
  create(wallet: Wallet, height: number, tx: TransactionStruct): Proposal {
    const seq = Date.now();
    this.message.data = {
      type: Message.TYPE_PROPOSAL,
      seq: seq,
      origin: wallet.getPublicKey(),
      height: height,
      tx: tx,
      sig: wallet.sign([Message.TYPE_PROPOSAL, seq, height, JSON.stringify(tx)].join()),
    };
    return this;
  }

  get(): ProposalStruct {
    return this.message.data as ProposalStruct;
  }

  static isValid(structProposal: ProposalStruct): boolean {
    return Util.verifySignature(
      structProposal.origin,
      structProposal.sig,
      [structProposal.type, structProposal.seq, structProposal.height, JSON.stringify(structProposal.tx)].join()
    );
  }
}
