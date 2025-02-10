import type { NextPageWithLayout } from '@/types';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import { useEffect, useState } from 'react';
import { getMyLoanInfo } from '@/apis';
import { useRouter } from 'next/router';
import BannerIcon from '@/assets/images/loan/banner.png';
import Image from '@/components/ui/image';
import { getStatusLabel } from '@/utils/getStatusLabel';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';

const Banner = ({ images }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  let intervalId: any;
  useEffect(() => {
    if (images.length > 1) {
      intervalId = setInterval(() => {
        setCurrentIndex((prev) => {
          return prev + 1 > images.length ? 0 : prev + 1;
        });
      }, 3000); // 每3秒切换一次
    }
    return () => intervalId && clearInterval(intervalId); // 清除定时器
  }, [images.length]);

  const extendedImages =
    images.length > 1
      ? [images[images.length - 1], ...images, images[0]]
      : images;

  return (
    <>
      {images.length ? (
        <div className="relative mb-4 flex h-[172px] w-full overflow-hidden rounded-3xl">
          {extendedImages.map((src: string, index: number) => (
            <div
              key={index}
              className="h-full w-full shrink-0 transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / images.length)
                }%)`,
              }}
            >
              <Image
                layout="fill"
                src={src || BannerIcon}
                alt={`Banner ${index}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

const MyLoan: NextPageWithLayout = () => {
  const router = useRouter();
  const [loanList, setLoanList] = useState<any>([]);
  const { publicKey } = useWallet();
  const [banner, setBanner] = useState<any>([]);
  const handleToDetail = (item: any) => {
    localStorage.setItem(`myLoan-${item.id}`, JSON.stringify(item));
    router.push(`/loanDetail?id=${item.id}`);
  };

  const getGlobalConfig = () => {
    const res = localStorage.getItem('GLOBAL_PARAMS_CONFIG');
    if (res) {
      setBanner(res ? JSON.parse(res).banners : []);
    }
  };

  const getMyLoanList = async () => {
    if (!publicKey) {
      return;
    }
    const res = await getMyLoanInfo({
      address: publicKey,
    });
    if (res) {
      setLoanList(res);
    }
  };

  useEffect(() => {
    getGlobalConfig();
  }, []);

  useEffect(() => {
    getMyLoanList();
  }, [publicKey]);
  return (
    <div className="h-full rounded-3xl">
      <main className="w-full max-w-screen-lg rounded-lg">
        <Banner images={banner} />
        {/* <div className="mb-3 rounded-3xl">
          <Image className="w-full" height={600} src={BannerIcon}></Image>
        </div> */}
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
