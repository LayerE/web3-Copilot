import React, { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import Button, { AppBtn, GlowBtn } from "../common/Button";
import BulkImageUploader from "../ImageUploader/BulkImage";
import {
  useAccount,
  useWalletClient,
  useSwitchNetwork,
  useNetwork,
} from "wagmi";
import Row, { ResponsiveRowWrap } from "../common/Row";
import LoadingIcon from "../LoadingIcon";
import { toast } from "react-hot-toast";
import Label from "../common/Label";
import { copyToClipboard, trimAddress } from "@/utils/common";
import { Copy, Link } from "react-feather";
import { BE_URL, useChatStore } from "@/store";
import { useAppState } from "@/context/app.context";
import {
  ABI,
  ADDRESS,
  ERC1155ABI,
  ERC1155ADDRESS,
  ZK721,
  ZK1155,
  TEST_ABI,
  TEST_ERC1155,
} from "@/utils/contractData";
import Web3 from "web3";
import axios from "axios";
import CSVUploader from "../ImageUploader/csvUpload";
type imgProp = {
  userImg: File | null;
  userImgPrev: string | ArrayBuffer | null;
};
type mintProps = {
  type: string;
  img: File | string;
  name: string;
  description: string;
  wallet: string;
  chain: string;
  id: string;
  csv: any;
};
const BulkMintForm = ({ formData, prompt }: { formData: any; prompt: any }) => {
  console.log(formData);

  const [selectedUserImg, setSelectedUserImg] = React.useState<any>({
    userImg: [],
    userImgPrev: null,
  });
  console.log(selectedUserImg);

  const { isLoggedIn, removeMintHistory, updateCurrentSession } =
    useChatStore();
  const [mintingStatus, setMinitingStatus] = useState(false);
  const [tx, setTx] = useState("");
  const [ipfs, setIpfsLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<any>(false);
  const { address, isConnected, connector } = useAccount();

  const { chains, switchNetworkAsync, error } = useSwitchNetwork();
  const { open, setImages, images } = useAppState();
  const { data: signer } = useWalletClient();

  const csvFileUpload = (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file !== undefined) {
      setCsvFile(file);
    } else {
      setCsvFile(false);
    }
  };

  // multiple image upload
  const userImgUpload = (e: any) => {
    e.preventDefault();
    const files = e.target.files;
    const filesArr = Array.prototype.slice.call(files);
    setSelectedUserImg({
      userImg: [...filesArr],
    });
    setImages([...filesArr]);
  };

  const updateMintStatus = async (id: any, hash: string, chain: any) => {
    try {
      const res = await axios.post(`${BE_URL}/analytics/deployment/status`, {
        id: id,
        hash: hash,
        chain: chain,
        type: "mint",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const MintNFT = async ({
    img,
    wallet,
    name,
    description,
    type,
    chain,
    csv,
  }: mintProps) => {
    try {
      let Chain = chain?.toLocaleLowerCase()?.includes("pos") ? 80001 : 80001;
      setLoading(true);
      if ((await connector?.getChainId()) !== Chain) {
        await switchNetworkAsync?.(Chain);
      }

      const formData = new FormData();

      for (let i = 0; i < selectedUserImg.userImg.length; i++) {
        formData.append("images", selectedUserImg.userImg[i]);
      }

      formData.append("name", name);
      formData.append("description", description);

      formData.append("metadata", csv);

      const res = await fetch(BE_URL + "/metadata/bulk", {
        method: "POST",
        body: formData,
      });
      if (res.status === 200) {
        const data = await res.json();
        console.log(data?.metadata, prompt?.mssgId, Chain);
        console.log(data);
        setIpfsLink(data?.metadata);
        const unspecifiedData: any = await signer;
        const provider = await connector?.getProvider();
        const web3 = new Web3(provider);

        if (type?.toLocaleLowerCase()?.includes("721")) {
          const contract = new web3.eth.Contract(
            ABI as any,
            Chain === 137 ? ADDRESS : ZK721
          );
          const mint = await contract?.methods
            ?.Mint(address, data?.metadata)
            ?.send({
              from: address,
            });
          console.log(mint);
          if (mint) {
            console.log(mint);
            setTx(mint?.transactionHash);
            setMinitingStatus(true);
            removeMintHistory(true);
            toast.success("Minting Successful");
            await updateMintStatus(prompt.mssgId, data?.metadata, Chain);
            updateCurrentSession((session) => {
              session.lastUpdate = new Date().toLocaleString();
              session.prompts.map((_prompt) => {
                if (_prompt.id === prompt.id) {
                  prompt.txData = `Tx hash: ${mint?.transactionHash} and the ipfs hash is ${data?.metadata}`;
                }
                return _prompt;
              });
            });
          }
        } else {
          const contract = new web3.eth.Contract(
            TEST_ABI as any,
            Chain === 137 ? TEST_ERC1155 : TEST_ERC1155
          );
          const mint = await contract?.methods
            ?.bulkMint(address, data?.metadata, data?.length)
            ?.send({
              from: address,
            });
          if (mint) {
            console.log(mint);
            setTx(mint?.transactionHash);
            setMinitingStatus(true);
            removeMintHistory(true);
            toast.success("Minting Successful");
            await updateMintStatus(prompt.mssgId, data?.metadata, Chain);
            updateCurrentSession((session) => {
              session.lastUpdate = new Date().toLocaleString();
              session.prompts.map((_prompt) => {
                if (_prompt.id === prompt.id) {
                  // convert to markdown
                  prompt.txData = `Tx hash: ${mint?.transactionHash} and the ipfs hash ${data?.metadata}`;
                }
                return _prompt;
              });
            });
          }
        }

        // const data = await res.json();
        // console.log(data);
        // setTx(data.tx);
        // setIpfsLink(data.ipfs);
        // setMinitingStatus(true);
        // removeMintHistory(true);
        // toast.success("Minting Successfull!");
      } else {
        if (res?.status === 400) {
          const error = await res.json();
          console.log(error);
          setMinitingStatus(false);
          toast.error(error?.error);
        } else {
          setMinitingStatus(false);
          toast.error("Minting Failed!");
        }
      }
    } catch (error) {
      console.log(error);
      setMinitingStatus(false);
      toast.error("Minting Failed!");
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = async (e: FormEvent) => {
    let JSONData = JSON.parse(formData);
    if (selectedUserImg.userImg && address) {
      MintNFT({
        ...formData,
        img: selectedUserImg.userImg,
        wallet: address,
        name: JSONData?.name,
        description: JSONData.description,
        type: JSONData.type,
        chain: JSONData.chain,
        csv: csvFile,
      } as mintProps);
    } else {
      toast.error("Image field can't be undefined!");
    }
  };

  return (
    <MintFormWrapper>
      <p>You can upload Multiple Images at once</p>
      <FormWrapper>
        <BulkImageUploader
          onChange={userImgUpload}
          src={
            selectedUserImg?.userImg?.length > 0
              ? URL.createObjectURL(selectedUserImg?.userImg[0])
              : ""
          }
        />
        <CSVUploader onChange={csvFileUpload} src={csvFile} />

        <input type="file" onChange={csvFileUpload} accept=".csv" />

        {/* <ConnectKitButton /> */}
        <Button
          disabled={
            !selectedUserImg?.userImg || !isConnected || mintingStatus
              ? true
              : false
          }
          onClick={onFormSubmit}
        >
          {loading
            ? "Minting..."
            : mintingStatus
            ? "Mint Successfull"
            : "Mint NFT"}
        </Button>
      </FormWrapper>
      {/* <Row style={{ flexWrap: "wrap", gap: ".5rem" }}>
        {tx?.length > 0 ? (
          <Label>
            <span>TxHash: {trimAddress(tx)}</span>
            <Copy onClick={() => copyToClipboard(tx)} size="1rem" />
          </Label>
        ) : null}
        {ipfs?.length > 0 ? (
          <a
            href={ipfs}
            target="_blank"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: ".25rem",
            }}
          >
            <Link size="1rem" /> <span>IPFS hash</span>
          </a>
        ) : null}
      </Row> */}
    </MintFormWrapper>
  );
};

const FormWrapper = styled.div`
  gap: 0.5rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;
const MintFormWrapper = styled.div`
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
`;
export default BulkMintForm;
