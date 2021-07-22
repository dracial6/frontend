enum GeneralBayType {
    /// <summary>
    /// Bay를 단독으로 표현하는 경우.
    /// </summary>
    OnlyBay,
    /// <summary>
    /// Hatch에 종속된 Bay을 표현하는 경우.
    /// </summary>
    BayofHatch,
    /// <summary>
    /// Bay를 단독으로 표현하는 경우, CPO값이 1인 슬롯만 표현합니다.
    /// </summary>
    OnlyBayByCPO
}

export default GeneralBayType;