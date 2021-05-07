import styled from 'styled-components';

export const PrefectureItemWrapper = styled.div``;

export const PrefectureItem = styled.div`
  padding-bottom: ${(props) => props.theme.spacing.default};
  .warning-item {
    background-color: ${(props) => props.theme.colors.alertColor};
  }
`;

export const PrefectureItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${(props) => props.theme.spacing.sm};
  align-items: center;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    flex-direction: column;
    margin-bottom: ${(props) => props.theme.spacing.default};
  }

  h4 {
    font-weight: 400;
  }
`;
