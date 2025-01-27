import type { NextPageWithLayout } from '@/types';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import { useEffect, useState } from 'react';
import { getMyLoanInfo } from '@/apis';
import { useRouter } from 'next/router';
import BannerIcon from '@/assets/images/loan/banner.png';
import Image from '@/components/ui/image';
import { getStatusLabel } from '@/utils/getStatusLabel';
// import { useWeb3 } from '@/contexts/Web3Context';
const MyLoan: NextPageWithLayout = () => {
  const router = useRouter();
  const [loanList, setLoanList] = useState<any>([]);
  const handleToDetail = (item: any) => {
    localStorage.setItem(`myLoan-${item.id}`, JSON.stringify(item));
    router.push(`/loanDetail?id=${item.id}`);
  };

  const getMyLoanList = async () => {
    const res = await getMyLoanInfo({
      address:
        'aleo1hac8kndgfp7eh545yeu6k2ue32yn3dt7qe5xl54d6lpe7xecyq9qkxc3tx',
    });
    if (res) {
      setLoanList(res);
    }
  };

  useEffect(() => {
    getMyLoanList();
  }, []);
  return (
    <div className="h-full rounded-3xl">
      <main className="w-full max-w-screen-lg rounded-lg">
        <div className="mb-3 rounded-3xl">
          <Image className="w-full" height={600} src={BannerIcon}></Image>
        </div>
        {loanList.length &&
          loanList.map((item: any) => {
            return (
              <section className="mb-4" key={item.id}>
                <div className="rounded-3xl bg-white p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm text-[#5C6166]">Amount</p>
                    <p className="text-sm text-[#1EBE70]">
                      {getStatusLabel(item.status)}
                    </p>
                    {/* {item.status === 'Reviewing' ? (
                      <p className="text-sm text-[#1EBE70]">
                        {getStatusLabel(item.status)}
                      </p>
                    ) : item.status === 'Not passed' ? (
                      <p className="text-sm text-[#FE4C30]">
                        {getStatusLabel(item.status)}
                      </p>
                    ) : (
                      <p className="text-sm text-[#FA9825]">
                        {getStatusLabel(item.status)}
                      </p>
                    )} */}
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-2xl font-bold text-[#18191A]">
                      ${item.release_amount}
                    </p>
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="mr-6 text-sm text-[#5C6166]">Contract</p>
                    <p className="text-overflow-ellipsis overflow-hidden truncate text-sm text-[#18191A]">
                      {item.aleo_address}
                    </p>
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm text-[#5C6166]">Type</p>
                    <p className="text-sm text-[#18191A]">
                      {item.type === 1 ? 'aleo' : 'pos'}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="rounded-full border border-[#191722] bg-white px-6 py-2 text-[#18191A]"
                      onClick={() => handleToDetail(item)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </section>
            );
          })}
      </main>
    </div>
  );
};

MyLoan.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
export default MyLoan;
