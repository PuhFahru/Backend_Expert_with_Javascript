import DomainErrorTranslator from '../DomainErrorTranslator.js';
import InvariantError from '../InvariantError.js';
import AuthenticationError from '../AuthenticationError.js';

describe('DomainErrorTranslator', () => {
  describe('REGISTER_USER errors', () => {
    it('should translate REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY', () => {
      expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')))
        .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'));
    });

    it('should translate REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION', () => {
      expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
        .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'));
    });

    it('should translate REGISTER_USER.USERNAME_LIMIT_CHAR', () => {
      expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
        .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'));
    });

    it('should translate REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER', () => {
      expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')))
        .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'));
    });

    it('should translate REGISTER_USER.PROPERTY_MUST_NOT_BE_EMPTY', () => {
      expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.PROPERTY_MUST_NOT_BE_EMPTY')))
        .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena properti tidak boleh kosong'));
    });
  });

  describe('USER_LOGIN errors', () => {
    it('should translate USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY', () => {
      expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY')))
        .toStrictEqual(new InvariantError('harus mengirimkan username dan password'));
    });

    it('should translate USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION', () => {
      expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION')))
        .toStrictEqual(new InvariantError('username dan password harus string'));
    });

    it('should translate USER_LOGIN.PROPERTY_MUST_NOT_BE_EMPTY', () => {
      expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.PROPERTY_MUST_NOT_BE_EMPTY')))
        .toStrictEqual(new InvariantError('username dan password tidak boleh kosong'));
    });
  });

  describe('REFRESH_AUTHENTICATION_USE_CASE errors', () => {
    it('should translate REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN', () => {
      expect(DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')))
        .toStrictEqual(new InvariantError('harus mengirimkan token refresh'));
    });

    it('should translate REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION', () => {
      expect(DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
        .toStrictEqual(new InvariantError('refresh token harus string'));
    });
  });

  describe('DELETE_AUTHENTICATION_USE_CASE errors', () => {
    it('should translate DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN', () => {
      expect(DomainErrorTranslator.translate(new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')))
        .toStrictEqual(new InvariantError('harus mengirimkan token refresh'));
    });

    it('should translate DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION', () => {
      expect(DomainErrorTranslator.translate(new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
        .toStrictEqual(new InvariantError('refresh token harus string'));
    });
  });

  describe('Authentication errors', () => {
    it('should translate Missing authentication', () => {
      expect(DomainErrorTranslator.translate(new Error('Missing authentication')))
        .toStrictEqual(new AuthenticationError('Missing authentication'));
    });
  });

  describe('NEW_THREAD errors', () => {
    it('should translate NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY', () => {
      expect(DomainErrorTranslator.translate(new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')))
        .toStrictEqual(new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'));
    });

    it('should translate NEW_THREAD.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE', () => {
      expect(DomainErrorTranslator.translate(new Error('NEW_THREAD.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE')))
        .toStrictEqual(new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'));
    });

    it('should translate NEW_THREAD.PROPERTY_MUST_NOT_BE_EMPTY', () => {
      expect(DomainErrorTranslator.translate(new Error('NEW_THREAD.PROPERTY_MUST_NOT_BE_EMPTY')))
        .toStrictEqual(new InvariantError('tidak dapat membuat thread baru karena properti tidak boleh kosong'));
    });
  });

  describe('NEW_COMMENT errors', () => {
    it('should translate NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY', () => {
      expect(DomainErrorTranslator.translate(new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')))
        .toStrictEqual(new InvariantError('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'));
    });

    it('should translate NEW_COMMENT.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE', () => {
      expect(DomainErrorTranslator.translate(new Error('NEW_COMMENT.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE')))
        .toStrictEqual(new InvariantError('tidak dapat membuat komentar baru karena tipe data tidak sesuai'));
    });

    it('should translate NEW_COMMENT.PROPERTY_MUST_NOT_BE_EMPTY', () => {
      expect(DomainErrorTranslator.translate(new Error('NEW_COMMENT.PROPERTY_MUST_NOT_BE_EMPTY')))
        .toStrictEqual(new InvariantError('tidak dapat membuat komentar baru karena properti tidak boleh kosong'));
    });
  });

  describe('NEW_REPLY errors', () => {
    it('should translate NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY', () => {
      expect(DomainErrorTranslator.translate(new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')))
        .toStrictEqual(new InvariantError('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada'));
    });

    it('should translate NEW_REPLY.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE', () => {
      expect(DomainErrorTranslator.translate(new Error('NEW_REPLY.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE')))
        .toStrictEqual(new InvariantError('tidak dapat membuat balasan baru karena tipe data tidak sesuai'));
    });

    it('should translate NEW_REPLY.PROPERTY_MUST_NOT_BE_EMPTY', () => {
      expect(DomainErrorTranslator.translate(new Error('NEW_REPLY.PROPERTY_MUST_NOT_BE_EMPTY')))
        .toStrictEqual(new InvariantError('tidak dapat membuat balasan baru karena properti tidak boleh kosong'));
    });
  });

  it('should return original error when error message is not needed to translate', () => {
    const error = new Error('some_error_message');
    const translatedError = DomainErrorTranslator.translate(error);
    expect(translatedError).toStrictEqual(error);
  });
});
