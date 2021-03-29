/**
 * Copyright (C) 2021 diva.exchange
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
 * Author/Maintainer: Konrad Bächler <konrad@diva.exchange>
 */

import { Server } from './net/server';
import { CONFIG_SERVER } from './config';

new Server(CONFIG_SERVER).listen().then((server) => {
  process.once('SIGINT', () => {
    server.shutdown().then(() => {
      process.exit(0);
    });
  });
  process.once('SIGTERM', () => {
    server.shutdown().then(() => {
      process.exit(0);
    });
  });
});
