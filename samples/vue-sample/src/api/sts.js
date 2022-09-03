import request from '@/utils/request';

export function assumeRole(){
  return request.get("/sts/assume-role");
}