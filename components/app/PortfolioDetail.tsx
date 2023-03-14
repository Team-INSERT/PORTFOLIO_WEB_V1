import { getKoreanDate } from "@/utils/date";
import type { Portfolio } from "@/types/portfolio.interface";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useRouter } from "next/router";
import useOverlay from "@/hooks/useOverlay";
import config from "@/config";
import httpClient from "@/apis";
import { useQueryClient } from "@tanstack/react-query";
import KEY from "@/models/key";
import useUser from "@/hooks/useUser";
import Button from "../atoms/DetailButton";
import MemberGroup from "../atoms/MemberGroup";
import Description from "../portfolio/Description";
import ShareIcon from "../Icon/ShareIcon";
import PeopleIcon from "../Icon/PeopleIcon";
import EmptyHeartIcon from "../Icon/EmptyHeartIcon";
import FilledHeartIcon from "../Icon/FilledHeartIcon";
import EditIcon from "../Icon/EditIcon";
import ChipGroup from "../atoms/ChipGroup";
import GithubIcon from "../Icon/GithubIcon";
import PencelIcon from "../Icon/PencelIcon";
import Input from "../atoms/Input";
import Kebab from "../common/KebabMenu";
import TrashCanIcon from "../Icon/TrashCanIcon";

interface PortfolioDetailProps {
  portfolio: Portfolio;
  bookmarkYn: boolean;
  followYn: boolean;
  isMyPortfolio: boolean;
  bookmarks: number;
  views: number;
}

export default function Detail({
  portfolio,
  bookmarkYn,
  followYn,
  isMyPortfolio,
  bookmarks,
  views,
}: PortfolioDetailProps) {
  const { openToast } = useOverlay();
  const { user: userInfo } = useUser();
  const router = useRouter();
  const url = `${config.clientUrl + router.asPath}`;
  const queryClient = useQueryClient();

  const handleLike = () => {
    httpClient.portfolio
      .bookmark({ portfolioId: portfolio.portfolioId })
      .then(() => queryClient.invalidateQueries([KEY.PORTFOLIO]))
      .catch((error) =>
        openToast(error.response.data.message, { type: "danger" }),
      );
  };

  const handleFollow = () => {
    httpClient.follow
      .post({ memberId: portfolio.writer.memberId })
      .then(() => queryClient.invalidateQueries([KEY.PORTFOLIO]))
      .catch((error) =>
        openToast(error.response.data.message, { type: "danger" }),
      );
  };

  const handleUnFollow = () => {
    httpClient.follow
      .unfollow({
        data: { memberId: portfolio.writer.memberId },
      })
      .then(() => queryClient.invalidateQueries([KEY.PORTFOLIO]))
      .catch((error) =>
        openToast(error.response.data.message, { type: "danger" }),
      );
  };

  const handleShare = () => {
    openToast("복사가 완료되었습니다.");
  };

  return (
    <div className="mt-small bg-white p-4 rounded">
      <div className="w-full h-full flex justify-between flex-col sm:flex-row">
        <div>
          <h2 className="flex gap-1 font-bold text-large mr-2 items-center">
            <span className="text-blue">({portfolio.portfolioTheme}) </span>
            <span className="break-all">{portfolio.title}</span>
            {portfolio.gitUrl && (
              <a
                href={portfolio.gitUrl}
                className="flex items-center bg-primary-light_gray rounded-full px-[0.5rem] py-[0.1rem] gap-[0.125rem] h-[1.5rem]"
              >
                <GithubIcon width={14} height={14} />
                <span className="text-primary-dark_gray text-[0.625rem] font-normal">
                  GitHub
                </span>
              </a>
            )}
          </h2>
          <span
            onClick={() => router.push(`/profile/${portfolio.writer.memberId}`)}
            className="cursor-pointer"
          >
            {portfolio.writer.name}
          </span>
          <ChipGroup
            skillList={portfolio.skillList}
            className="mt-small"
            type="detail"
          />
          <span className="block my-small">
            조회수 {views}회 · {getKoreanDate(portfolio.createdDate)}
          </span>
        </div>

        <div>
          <div className="flex justify-end items-center gap-small mb-large h-[2.25rem]">
            <Button status="active" onClick={handleLike}>
              {bookmarkYn ? (
                <FilledHeartIcon className="mr-2xsmall" />
              ) : (
                <EmptyHeartIcon className="mr-2xsmall" />
              )}
              <span className="text-small">{bookmarks}</span>
            </Button>

            {!isMyPortfolio ? (
              <Button
                status="active"
                onClick={followYn ? handleUnFollow : handleFollow}
                className={followYn ? "!bg-somago_yellow" : ""}
              >
                <PeopleIcon className="mr-2xsmall" />
                <span className="text-small">
                  {followYn ? "팔로잉" : "팔로우"}
                </span>
              </Button>
            ) : (
              <Button
                status="active"
                className="text-small"
                onClick={() => router.push(`${router.asPath}/edit`)}
              >
                <EditIcon className="mr-2xsmall w-4 h-4" />
                수정
              </Button>
            )}

            <CopyToClipboard text={url}>
              <Button status="active" onClick={handleShare}>
                <ShareIcon className="mr-2xsmall" />
                <span className="text-small">공유</span>
              </Button>
            </CopyToClipboard>

            {userInfo.memberRoleType === "ROLE_ADMIN" ||
              (true && (
                <>
                  <div className="flex items-center bg-primary-dark_gray px-[0.75rem] py-[0.75rem] rounded-full text-white gap-[0.5rem]">
                    <span className="text-[0.75rem] font-normal">
                      노출순위 변경하기:
                    </span>
                    <Input className="w-[1.25rem] h-[1.25rem]" />
                    <PencelIcon />
                  </div>
                  <Kebab.Provider className="z-30">
                    <Kebab.Menu className="rounded">
                      <Kebab.Item
                        className="pb-[0.3125rem] rounded-t bg-white"
                        onClick={() => 1}
                      >
                        <EditIcon className="w-3 h-3 mr-3" />
                        <span>수정</span>
                      </Kebab.Item>
                      <Kebab.Item
                        className="pt-[0.3125rem] rounded-b bg-white"
                        onClick={() => 1}
                      >
                        <TrashCanIcon className="w-3 h-3 mr-3" />
                        <span>삭제</span>
                      </Kebab.Item>
                    </Kebab.Menu>
                  </Kebab.Provider>
                </>
              ))}
          </div>
          {portfolio.contributorList.length > 0 && (
            <div className="mb-large flex justify-end">
              <MemberGroup writers={[userInfo, ...portfolio.contributorList]} />
            </div>
          )}
        </div>
      </div>
      <Description>{portfolio.description}</Description>
    </div>
  );
}
