enum CubeType {
    /// <summary>
    /// Cube 적용하지 않음
    /// </summary>
    None,
    /// <summary>
    /// Container Height에 따른 Cube 적용
    /// </summary>
    HighContainer,
    /// <summary>
    /// Container Height에 따른 Slot Cube 적용
    /// Slot Cube를 적용하면 Cotainer 도 Cube가 적용된다.
    /// </summary>
    HighSlot            
}

export default CubeType;