import {UpgradeAdapter} from '@angular/upgrade';
export const upgradeAdapter = new UpgradeAdapter();

upgradeAdapter.upgradeNg1Provider('$analytics');