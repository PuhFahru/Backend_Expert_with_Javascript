import AuthenticationError from './AuthenticationError.js';
import AuthorizationError from './AuthorizationError.js';
import InvariantError from './InvariantError.js';

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'Missing authentication': new AuthenticationError('Missing authentication'),
  'REGISTER_USER.PROPERTY_MUST_NOT_BE_EMPTY': new InvariantError('tidak dapat membuat user baru karena properti tidak boleh kosong'),
  'USER_LOGIN.PROPERTY_MUST_NOT_BE_EMPTY': new InvariantError('username dan password tidak boleh kosong'),
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'NEW_THREAD.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
  'NEW_THREAD.PROPERTY_MUST_NOT_BE_EMPTY': new InvariantError('tidak dapat membuat thread baru karena properti tidak boleh kosong'),
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'),
  'NEW_COMMENT.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE': new InvariantError('tidak dapat membuat komentar baru karena tipe data tidak sesuai'),
  'NEW_COMMENT.PROPERTY_MUST_NOT_BE_EMPTY': new InvariantError('tidak dapat membuat komentar baru karena properti tidak boleh kosong'),
  'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada'),
  'NEW_REPLY.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE': new InvariantError('tidak dapat membuat balasan baru karena tipe data tidak sesuai'),
  'NEW_REPLY.PROPERTY_MUST_NOT_BE_EMPTY': new InvariantError('tidak dapat membuat balasan baru karena properti tidak boleh kosong'),
};

export default DomainErrorTranslator;
