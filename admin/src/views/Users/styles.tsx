import styled from 'styled-components';

export const ContainerWrapper = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.default};
  padding: ${(props) => props.theme.spacing.default};
  background-color: ${(props) => props.theme.colors.white};
  border: 1px solid #00000012;
`;

export const Section = styled.div`
  margin-top: ${(props) => props.theme.spacing.default};
  > div:nth-child(1) {
    display: flex;
    justify-content: space-between;
  }
  h3 {
    font-weight: 300;
    font-size: 24px;
  }
`;
