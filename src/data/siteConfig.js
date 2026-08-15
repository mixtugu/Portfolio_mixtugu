// 연락처는 평문으로 두면 빌드된 번들을 정규식으로 훑는 스팸 수집 봇에 그대로 노출된다.
// 뒤집은 문자열을 base64로 인코딩해 보관하고, 실제 값은 revealContact()로 런타임에만 복원한다.
const encodedContact = {
  japanPhone: 'Njc5MC0xNjU3LTA4IDE4Kw==',
  email: 'bW9jLmxpYW1nQDk3MDB5bW1pdA==',
};

export const maskedContact = {
  japanPhone: '+81 80-****-****',
  email: 't*****@gmail.com',
};

export const revealContact = (key) => {
  const encoded = encodedContact[key];

  if (!encoded) {
    return '';
  }

  return atob(encoded).split('').reverse().join('');
};

export const siteConfig = {
  ko: {
    brandName: '이서정',
    schoolName: '도쿄대학교 학제정보학부',
  },
  ja: {
    brandName: 'イソジョン',
    schoolName: '東京大学 学際情報学府',
  },
  en: {
    brandName: 'LeeSeojung',
    schoolName: 'The University of Tokyo Interfaculty Initiative in Information Studies',
  },
};
