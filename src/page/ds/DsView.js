import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Td,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faCommentDots,
  faHeart as emptyHeart,
} from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../component/LoginProvider";
import { DsComment } from "./DsComment";

function LikeContainer({ like, onClick }) {
  const { isAuthenticated } = useContext(LoginContext);

  if (like === null) {
    return <Spinner />;
  }

  return (
    <Flex>
      <Tooltip isDisabled={isAuthenticated()} hasArrow label={"로그인 하세요"}>
        <Button variant="ghost" size="xl" onClick={onClick}>
          {like.like && (
            <FontAwesomeIcon icon={emptyHeart} size="xl" color="red" />
          )}
          {like.like || (
            <FontAwesomeIcon icon={fullHeart} size="xl" color="red" />
          )}
        </Button>
      </Tooltip>
      <Heading color={"red"} size="lg">
        {like.countLike}
      </Heading>
    </Flex>
  );
}

export function DsView({ dsId }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const [currentImageShowIndex, setCurrentImageShowIndex] = useState(0);

  const { hasAccess, isAdmin } = useContext(LoginContext);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const [ds, setDs] = useState("");
  const [like, setLike] = useState("");

  const realId = dsId || id;

  const imageShowLength = ds.files ? ds.files.length : 0;
  useEffect(() => {
    if (imageShowLength > 0) {
      const interval = setInterval(() => {
        setCurrentImageShowIndex((c) => (c + 1) % imageShowLength);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [ds]);

  useEffect(() => {
    if (realId) {
      axios
        .get("/api/ds/id/" + realId)
        .then((response) => setDs(response.data));
    }
  }, [realId]);

  useEffect(() => {
    if (realId) {
      axios
        .get("/api/business/like/dsId/" + realId)
        .then((response) => setLike(response.data));
    }
  }, [realId]);

  if (realId === undefined || ds === null) {
    return <Spinner />;
  }

  function handleDelete() {
    axios
      .delete("/api/ds/delete/" + realId)
      .then((response) => {
        toast({
          description: realId + "번 정보가 삭제되었습니다",
          status: "success",
        });
        navigate("/home/ds/list");
      })
      .catch((error) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => onClose());
  }

  function handleLike() {
    axios
      .post("/api/business/like", { businessId: ds.id })
      .then((response) => {
        setLike(response.data);
      })
      .catch(() => {})
      .finally(() => {});
  }

  return (
    <Table border="1px solid red">
      <Card>
        <CardHeader>
          <Flex>
            <Center className="font-dongle text-5xl">{ds.name}</Center>
          </Flex>
        </CardHeader>
        <Box
          w="100%"
          h="200px"
          sx={{ marginTop: "20px", marginBottom: "20px" }}
          position="relative"
        >
          {ds.files &&
            ds.files.map((file, index) => (
              <Box
                key={file.id}
                position="absolute"
                opacity={currentImageShowIndex === index ? 1 : 0}
                transition="opacity 0.5s"
              >
                <Image
                  src={file.url}
                  alt={file.name}
                  width="350px"
                  height="200px"
                />
              </Box>
            ))}
        </Box>
        <Flex color="white" w="100%" h="100px" border="1px solid black">
          <Center w="33%" color="black" borderTop="1px solid lightgrey">
            <Text fontSize="2xl">정보</Text>
          </Center>
          <Center
            w="33%"
            size="150px"
            border="1px solid lightgrey"
            borderBottom="none"
          >
            <LikeContainer like={like} onClick={handleLike} />
          </Center>
          <Center w="33%" color="black" borderTop="1px solid lightgrey">
            <Text fontSize="2xl">리뷰</Text>
          </Center>
        </Flex>
        <Button
          border="1px solid lightgrey"
          bg="white"
          width="100%"
          height="50px"
          marginTop="10px"
          marginRight="55px"
          marginBottom="10px"
          fontSize="1.5xl"
          onClick={() => navigate("/home/cs/qaList")}
        >
          <FontAwesomeIcon icon={faCommentDots} size="lg" />
          문의
        </Button>
        {/*<FormControl>*/}
        {/*  <FormLabel>업체 명</FormLabel>*/}
        {/*  <Input border="none" value={ds.name} isReadOnly />*/}
        {/*</FormControl>*/}
        {/*<FormControl>*/}
        {/*  <FormLabel>주소</FormLabel>*/}
        {/*  <Input border="none" value={ds.address} isReadOnly />*/}
        {/*</FormControl>*/}
        {/*<FormControl>*/}
        {/*  <FormLabel>번호</FormLabel>*/}
        {/*  <Input border="none" value={ds.phone} isReadOnly />*/}
        {/*</FormControl>*/}

        {/*<FormControl*/}
        {/*  display={*/}
        {/*    ds.holidays > 0 && ds.holidays.length === 0 ? "none" : "block"*/}
        {/*  }*/}
        {/*>*/}
        {/*  <FormLabel>휴무일</FormLabel>*/}
        {/*  <Input*/}
        {/*    border="none"*/}
        {/*    value={*/}
        {/*      ds.holidays != null &&*/}
        {/*      ds.holidays.map((holiday) => holiday.holiday)*/}
        {/*    }*/}
        {/*    isReadOnly*/}
        {/*  />*/}
        {/*</FormControl>*/}

        {/*<Box>*/}
        {/*  <Flex>*/}
        {/*    <FormControl>*/}
        {/*      <Flex>*/}
        {/*        <FormLabel>오픈 시간</FormLabel>*/}
        {/*        <Input w={"100px"} value={ds.openHour} isReadOnly />*/}
        {/*        <Input w={"100px"} mx={"30px"} value={ds.openMin} isReadOnly />*/}
        {/*      </Flex>*/}

        {/*      <Flex>*/}
        {/*        <FormLabel>마감 시간</FormLabel>*/}
        {/*        <Input w={"100px"} value={ds.closeHour} isReadOnly />*/}
        {/*        <Input w={"100px"} mx={"30px"} value={ds.closeMin} isReadOnly />*/}
        {/*        <FormLabel>야간 진료</FormLabel>*/}
        {/*        <Checkbox isChecked={ds.nightCare} isReadOnly />*/}
        {/*      </Flex>*/}
        {/*      <Box display={ds.restHour === 0 ? "none" : "block"}>*/}
        {/*        <Flex>*/}
        {/*          <FormLabel>휴식 시간</FormLabel>*/}
        {/*          <Input w={"100px"} value={ds.restHour} isReadOnly />*/}
        {/*          <Input w={"100px"} value={ds.restMin} isReadOnly />*/}
        {/*          ~*/}
        {/*          <Input w={"100px"} value={ds.restCloseHour} isReadOnly />*/}
        {/*          <Input w={"100px"} value={ds.restCloseMin} isReadOnly />*/}
        {/*        </Flex>*/}
        {/*      </Box>*/}
        {/*    </FormControl>*/}
        {/*  </Flex>*/}
        {/*</Box>*/}
        <Td>
          <FormLabel fontWeight="bold" fontSize="21px" color="grey">
            병원 주소
          </FormLabel>
          <Text>{ds.address}</Text>
        </Td>
        <Td>
          <Flex>
            <FormLabel fontWeight="bold" fontSize="18px" color="grey">
              전화번호
            </FormLabel>
            <Text>{ds.phone} </Text>
          </Flex>
        </Td>
        <Td>
          <Flex>
            <FormLabel fontWeight="bold" fontSize="18px" color="grey">
              오픈시간
            </FormLabel>
            <Text>{ds.openHour}시</Text>
            <Text>{ds.openMin === 0 ? "0" + ds.openMin : ds.openMin}분</Text>
          </Flex>
        </Td>
        {ds.restHour !== 0 && (
          <Td>
            <Flex>
              <FormLabel fontWeight="bold" fontSize="18px" color="grey">
                휴게시간
              </FormLabel>
              <Text>{ds.restHour} 시</Text>
              <Text>{ds.restMin === 0 ? "0" + ds.restMin : ds.restMin} 분</Text>
              <FormLabel marginLeft="10px">~</FormLabel>
              <Text>{ds.restCloseHour} 시</Text>
              <Text>
                {ds.restCloseMin === 0
                  ? "0" + ds.restCloseMin
                  : ds.restCloseMin}{" "}
                분
              </Text>
            </Flex>
          </Td>
        )}
        <Td>
          <Flex>
            <FormLabel fontWeight="bold" fontSize="18px" color="grey">
              마감시간
            </FormLabel>
            <Text>{ds.closeHour}시</Text>

            <Text>{ds.closeMin === 0 ? "0" + ds.closeMin : ds.closeMin}분</Text>
          </Flex>
        </Td>
        <Td>
          <FormLabel fontWeight="bold" fontSize="18px" color="grey">
            상세정보
          </FormLabel>
          <Text>{ds.content}</Text>
        </Td>
        <Td>
          <FormLabel>약국 소개</FormLabel>
          <Input border="none" value={ds.content} isReadOnly />
        </Td>
        <Td display={ds.info === "" ? "none" : "block"}>
          <FormLabel>약국 정보</FormLabel>
          <Input border="none" value={ds.info} isReadOnly />
        </Td>
        {/*{(hasAccess(ds.id) || isAdmin()) && (*/}
        {/*  <Box>*/}
        {/*    <Button*/}
        {/*      colorScheme="blue"*/}
        {/*      onClick={() => navigate("/home/ds/edit/" + realId)}*/}
        {/*    >*/}
        {/*      수정*/}
        {/*    </Button>*/}
        {/*    <Button*/}
        {/*      colorScheme="red"*/}
        {/*      mx="30px"*/}
        {/*      onClick={() => {*/}
        {/*        onOpen();*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      삭제*/}
        {/*    </Button>*/}
        {/*  </Box>*/}
        {/*)}*/}
        {/*/!*삭제 클릭시 모달*!/*/}
        {/*<Modal isOpen={isOpen} onClose={onClose}>*/}
        {/*  <ModalOverlay />*/}
        {/*  <ModalContent>*/}
        {/*    <ModalHeader>삭제 확인</ModalHeader>*/}
        {/*    <ModalCloseButton />*/}
        {/*    <ModalBody>삭제 시 복구 할 수 없습니다</ModalBody>*/}

        {/*    <ModalFooter>*/}
        {/*      <Button onClick={onClose}>닫기</Button>*/}
        {/*      <Button onClick={handleDelete} colorScheme="red">*/}
        {/*        삭제*/}
        {/*      </Button>*/}
        {/*    </ModalFooter>*/}
        {/*  </ModalContent>*/}
        {/*</Modal>*/}
        <DsComment businessId={realId} />
      </Card>
    </Table>
  );
}

export default DsView;
