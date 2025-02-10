// loan
import type { NextPageWithLayout } from '@/types';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import LoanIcon from '@/assets/images/loan/loan-icon-1.png';
import Image from '@/components/ui/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getLpQuantity } from '@/apis';
import { WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { getAleoBalance } from '@/apis';

interface ILpQuantity {
  borrowing_amount: string;
  collateral_amount: string;
  collateral_rate: string;
  installment: {
    installments: number;
    day_per_installment: number;
    interest_rate: string;
    interest_installment: string;
  }[];
}

const Loan: NextPageWithLayout = () => {
  const router = useRouter();
  const [pledgeAmount, setPledgeAmount] = useState('0.00');
  const [obtainFunds, setObtainFunds] = useState<ILpQuantity>({
    borrowing_amount: '0',
    collateral_amount: '0',
    collateral_rate: '0',
    installment: [],
  });
  const [pageConfig, setPageConfig] = useState<any>({});
  const [aleoBalance, setAleoBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const { publicKey } = useWallet();

  const getLpQuantityApi = async (value: string) => {
    setLoading(true);
    try {
      const res: ILpQuantity = await getLpQuantity({ amount: Number(value) });
      if (res) {
        setPledgeAmount(value);
        setObtainFunds(res);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getLoanParamsConfig = async () => {
    const res = localStorage.getItem('GLOBAL_PARAMS_CONFIG');
    if (res) {
      setPageConfig(res ? JSON.parse(res) : {});
    }
  };

  const getBalance = async () => {
    if (!publicKey) {
      setAleoBalance(0);
      return;
    }
    try {
      const result: any = await getAleoBalance(publicKey);
      var balanceString = result.data as string;
      balanceString = balanceString.substring(0, balanceString.length - 3);
      const balance = parseFloat(balanceString) / 1000000;
      setAleoBalance(balance);
    } catch (e) {
      console.log('get aleo balance error: ', e);
    }
  };

  useEffect(() => {
    getLoanParamsConfig();
  }, []);

  useEffect(() => {
    getBalance();
  }, [publicKey]);

  const handleToReceive = () => {
    if (loading) {
      return alert('please wait for your previous operation to complete');
    }
    router.push('/receiveLoan');
    localStorage.setItem(
      'obtainFunds',
      JSON.stringify({ ...obtainFunds, user_aleo_amount: pledgeAmount })
    );
  };
  return (
    <div className="h-full rounded-3xl bg-white">
      <main className="w-full max-w-screen-lg rounded-lg">
        <div className="bg-[#f4f4f4]">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-4xl font-bold text-black">Borrow</h1>
            <p className="text-xl tracking-tighter  text-black">
              <span
                className="text-sm text-gray-400"
                style={{ letterSpacing: '-2px' }}
              >
                ALEO Price
              </span>
              <span className="ml-1 text-lg font-bold">
                ${pageConfig.price || 0}
              </span>
            </p>
          </div>

          <p className="pb-6 text-[#1EBE70]">Pledge Aleo to obtain funds</p>
        </div>

        <div
          className="mt-[-16px] rounded-3xl p-6 pb-16"
          style={{ background: 'linear-gradient(90deg, #02090F, #032D2B)' }}
        >
          <div className="mb-2 flex items-center text-xl text-yellow-400">
            <Image width={20} height={20} src={LoanIcon}></Image>
            <span className="ml-2 text-[#FA9825]">ALEO Balance</span>
          </div>
          <h2 className="flex text-4xl font-bold text-white">
            <span className="mr-1 text-xl">$</span>
            <div className="flex items-end">
              {aleoBalance}
              <i className="ml-2 text-2xl">ALEO</i>
            </div>
          </h2>
        </div>

        <div className="h-600 mt-[-40px] rounded-3xl bg-white p-6">
          <div className="mb-2 text-2xl font-bold text-black">Pledge</div>
          {/* <div className="flex gap-2">
            <button className="flex-1 rounded-lg border border-black bg-white py-3 text-gray-700">
              ALEO
            </button>
            <button className="flex-1 rounded-lg border border-black bg-white py-3 text-gray-700">
              POS NODE ALEO
            </button>
          </div> */}

          <div className="mt-4 flex items-center rounded-lg bg-gray-100 px-4 py-2">
            <div className="flex flex-grow items-center">
              <span className="text-[#FE4C30]">ALEO</span>
              <input
                type="number"
                value={pledgeAmount}
                onChange={(e) => setPledgeAmount(e.target.value)}
                onBlur={(e) => getLpQuantityApi(e.target.value)}
                className="w-full border-0 bg-transparent text-3xl font-bold text-[#18191A]"
              />
            </div>
            <button className="ml-auto rounded-lg bg-[#1EBE70] px-6 py-3 text-white">
              MAX
            </button>
          </div>
          <div className="relative mb-1 mt-6">
            <label className="absolute left-4 top-[-7px] block bg-white text-xs text-black">
              Obtain funds
            </label>
            <input
              type="number"
              value={obtainFunds.borrowing_amount}
              onChange={() => {}}
              disabled
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-xl text-[#B8C2CC]"
            />
            <label className="absolute right-4 top-4 block bg-white text-xs text-black">
              AIDI
            </label>
          </div>

          <p className="mb-10 text-xs text-[#8A9199]">
            Weekly interest rate{' '}
            {(
              (obtainFunds.installment && obtainFunds.installment.length
                ? Number(obtainFunds.installment[0]?.interest_rate)
                : 0) * 100
            ).toFixed(2)}
            %–
            {(
              (obtainFunds.installment && obtainFunds.installment.length
                ? Number(
                    obtainFunds.installment[obtainFunds.installment.length - 1]
                      ?.interest_rate
                  )
                : 0) * 100
            ).toFixed(2)}
            %
          </p>

          <button
            className="mt-6 w-full rounded-full bg-green-500 px-6 py-3 text-white"
            onClick={handleToReceive}
          >
            Confirm
          </button>
        </div>
      </main>
    </div>
  );
};

Loan.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Loan;
