import { AuthCredentialsDto, createProfileDto, JwtResponse } from 'dto';
import FormData from 'form-data';
import { Axios } from './axios';

export const loginApi = async (credentials: AuthCredentialsDto) => {
  return Axios.post<JwtResponse>('/auth/signin', credentials);
};

export const createProfileApi = async (data: createProfileDto) => {
  const payload = new FormData() as any;

  payload.append('firstName', data.firstName);
  payload.append('lastName', data.lastName);
  payload.append('birthDay', data.birthDay);

  if (data.photo) {
    let filename = data.photo.uri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);

    payload.append('photo', {
      uri: data.photo.uri,
      type: match ? `image/${match[1]}` : `image`,
      name: data.photo.uri.split('/').pop(),
    });
  }

  return Axios.post<void>('/profile/create', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    transformRequest: () => {
      return payload;
    },
  });
};
